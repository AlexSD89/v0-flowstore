"""Caching utilities for mission metadata.

The spec mandates Redis for active mission caching. We attempt to use it when
configuration is present, falling back to an in-process cache for tests.
"""
from __future__ import annotations

import os
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Tuple

try:
    import redis
except ImportError:  # pragma: no cover - optional dependency
    redis = None  # type: ignore


@dataclass
class CacheEntry:
    value: object
    expires_at: datetime


class MissionCache:
    def set(self, key: str, value: object, ttl_seconds: int = 600) -> None:
        raise NotImplementedError

    def get(self, key: str) -> Optional[object]:
        raise NotImplementedError

    def drop(self, key: str) -> None:
        raise NotImplementedError

    def stats(self) -> Tuple[int, int]:
        raise NotImplementedError


class InMemoryMissionCache(MissionCache):
    def __init__(self) -> None:
        self._store: Dict[str, CacheEntry] = {}

    def set(self, key: str, value: object, ttl_seconds: int = 600) -> None:
        self._store[key] = CacheEntry(
            value=value,
            expires_at=datetime.now(timezone.utc) + timedelta(seconds=ttl_seconds),
        )

    def get(self, key: str) -> Optional[object]:
        entry = self._store.get(key)
        if not entry:
            return None
        if entry.expires_at < datetime.now(timezone.utc):
            self._store.pop(key, None)
            return None
        return entry.value

    def drop(self, key: str) -> None:
        self._store.pop(key, None)

    def stats(self) -> Tuple[int, int]:
        total = len(self._store)
        active = sum(1 for entry in self._store.values() if entry.expires_at >= datetime.now(timezone.utc))
        return total, active


class RedisMissionCache(MissionCache):
    """Redis-backed cache satisfying the architecture requirements."""

    def __init__(self, client: "redis.Redis", namespace: str = "pocketcorn") -> None:
        self._client = client
        self._namespace = namespace

    def _key(self, key: str) -> str:
        return f"{self._namespace}:{key}"

    def set(self, key: str, value: object, ttl_seconds: int = 600) -> None:
        payload = value.__getstate__() if hasattr(value, "__getstate__") else value  # pragma: no cover
        self._client.setex(self._key(key), ttl_seconds, MissionCacheSerializer.serialize(payload))

    def get(self, key: str) -> Optional[object]:
        raw = self._client.get(self._key(key))
        if raw is None:
            return None
        return MissionCacheSerializer.deserialize(raw)

    def drop(self, key: str) -> None:
        self._client.delete(self._key(key))

    def stats(self) -> Tuple[int, int]:
        pattern = f"{self._namespace}:mission:*"
        keys = list(self._client.scan_iter(match=pattern))
        return len(keys), len(keys)

    @classmethod
    def fallback(cls) -> MissionCache:
        url = os.getenv("POCKETCORN_REDIS_URL")
        if not url or redis is None:
            return InMemoryMissionCache()
        client = redis.from_url(url)
        return cls(client)


class MissionCacheSerializer:
    """Serialize cache payloads safely.

    We keep a lightweight JSON based serializer so cached summaries can be
    interchanged between Redis and local memory without relying on pickle.
    """

    @staticmethod
    def serialize(value: Any) -> str:
        from json import dumps

        if hasattr(value, "model_dump"):
            return dumps(value.model_dump(mode="json"))
        return dumps(value)

    @staticmethod
    def deserialize(payload: bytes | str) -> Any:
        from json import loads

        data = loads(payload if isinstance(payload, str) else payload.decode("utf-8"))
        if isinstance(data, dict) and "mission_id" in data and "run_timestamp" in data:
            try:
                from pocketcorn.collectors.models import MissionRunSummary

                return MissionRunSummary(**data)
            except Exception:  # pragma: no cover - degraded path
                return data
        return data


def default_cache() -> MissionCache:
    return RedisMissionCache.fallback()
