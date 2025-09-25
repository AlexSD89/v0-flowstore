"""Persistence utilities for mission results with MySQL + Redis alignment."""
from __future__ import annotations

import json
import os
import sqlite3
from abc import ABC, abstractmethod
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Dict, Iterable, List, Optional

from pocketcorn.collectors.models import DiscoveryMission, MissionRunSummary

RETENTION_DAYS_DEFAULT = 180


class PersistenceLayer(ABC):
    """Abstract persistence API for missions and runs."""

    def __init__(self, retention_days: int = RETENTION_DAYS_DEFAULT) -> None:
        self.retention_days = retention_days

    @abstractmethod
    def save_mission(self, mission: DiscoveryMission) -> None: ...

    @abstractmethod
    def get_mission(self, mission_id: str) -> Optional[DiscoveryMission]: ...

    @abstractmethod
    def list_missions(self) -> Iterable[DiscoveryMission]: ...

    @abstractmethod
    def save_run(self, summary: MissionRunSummary) -> None: ...

    @abstractmethod
    def get_run(self, run_id: str) -> Optional[MissionRunSummary]: ...

    @abstractmethod
    def list_runs(self, mission_id: Optional[str] = None) -> List[MissionRunSummary]: ...

    @staticmethod
    def serialize_run(summary: MissionRunSummary) -> Dict[str, object]:
        payload = summary.model_dump(mode="json")
        payload["audit_trail"] = [event.model_dump(mode="json") for event in summary.audit_trail_events]
        payload["analysis_summary"] = summary.companies_detected
        payload.pop("audit_trail_events", None)
        return payload

    def _prune_old_runs(self, runs: List[MissionRunSummary]) -> List[MissionRunSummary]:
        threshold = datetime.now(timezone.utc) - timedelta(days=self.retention_days)
        return [run for run in runs if run.run_timestamp >= threshold]


class InMemoryPersistenceLayer(PersistenceLayer):
    def __init__(self, retention_days: int = RETENTION_DAYS_DEFAULT) -> None:
        super().__init__(retention_days)
        self._missions: Dict[str, DiscoveryMission] = {}
        self._runs: Dict[str, MissionRunSummary] = {}

    def save_mission(self, mission: DiscoveryMission) -> None:
        self._missions[str(mission.mission_id)] = mission

    def get_mission(self, mission_id: str) -> Optional[DiscoveryMission]:
        return self._missions.get(str(mission_id))

    def list_missions(self) -> Iterable[DiscoveryMission]:
        return self._missions.values()

    def save_run(self, summary: MissionRunSummary) -> None:
        self._runs[str(summary.run_id)] = summary
        pruned = self._prune_old_runs(list(self._runs.values()))
        self._runs = {str(run.run_id): run for run in pruned}

    def get_run(self, run_id: str) -> Optional[MissionRunSummary]:
        return self._runs.get(str(run_id))

    def list_runs(self, mission_id: Optional[str] = None) -> List[MissionRunSummary]:
        runs = list(self._runs.values())
        if mission_id is not None:
            runs = [run for run in runs if str(run.mission_id) == str(mission_id)]
        return self._prune_old_runs(runs)


class SQLPersistenceLayer(PersistenceLayer):
    """SQLite-backed implementation mimicking the MySQL contract."""

    def __init__(self, dsn: str, retention_days: int = RETENTION_DAYS_DEFAULT) -> None:
        super().__init__(retention_days)
        self._path = Path(dsn.replace("sqlite://", ""))
        self._conn = sqlite3.connect(self._path)
        self._conn.row_factory = sqlite3.Row
        self._ensure_schema()

    def _ensure_schema(self) -> None:
        cur = self._conn.cursor()
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS missions (
                mission_id TEXT PRIMARY KEY,
                payload TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        cur.execute(
            """
            CREATE TABLE IF NOT EXISTS mission_runs (
                run_id TEXT PRIMARY KEY,
                mission_id TEXT NOT NULL,
                payload TEXT NOT NULL,
                run_timestamp TEXT NOT NULL
            )
            """
        )
        self._conn.commit()

    def save_mission(self, mission: DiscoveryMission) -> None:
        payload = mission.model_dump(mode="json")
        cur = self._conn.cursor()
        cur.execute(
            """
            INSERT INTO missions (mission_id, payload, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(mission_id) DO UPDATE SET payload=excluded.payload, updated_at=excluded.updated_at
            """,
            (str(mission.mission_id), json.dumps(payload), datetime.now(timezone.utc).isoformat()),
        )
        self._conn.commit()

    def get_mission(self, mission_id: str) -> Optional[DiscoveryMission]:
        cur = self._conn.cursor()
        cur.execute("SELECT payload FROM missions WHERE mission_id = ?", (str(mission_id),))
        row = cur.fetchone()
        if not row:
            return None
        data = json.loads(row["payload"])
        return DiscoveryMission(**data)

    def list_missions(self) -> Iterable[DiscoveryMission]:
        cur = self._conn.cursor()
        cur.execute("SELECT payload FROM missions")
        for row in cur.fetchall():
            yield DiscoveryMission(**json.loads(row["payload"]))

    def save_run(self, summary: MissionRunSummary) -> None:
        payload = summary.model_dump(mode="json")
        cur = self._conn.cursor()
        cur.execute(
            """
            INSERT INTO mission_runs (run_id, mission_id, payload, run_timestamp)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(run_id) DO UPDATE SET payload=excluded.payload, run_timestamp=excluded.run_timestamp
            """,
            (
                str(summary.run_id),
                str(summary.mission_id),
                json.dumps(payload),
                summary.run_timestamp.isoformat(),
            ),
        )
        self._conn.commit()
        self._enforce_retention(cur)

    def _enforce_retention(self, cur: sqlite3.Cursor) -> None:
        threshold = datetime.now(timezone.utc) - timedelta(days=self.retention_days)
        cur.execute(
            "DELETE FROM mission_runs WHERE run_timestamp < ?",
            (threshold.isoformat(),),
        )
        self._conn.commit()

    def get_run(self, run_id: str) -> Optional[MissionRunSummary]:
        cur = self._conn.cursor()
        cur.execute("SELECT payload FROM mission_runs WHERE run_id = ?", (str(run_id),))
        row = cur.fetchone()
        if not row:
            return None
        return MissionRunSummary(**json.loads(row["payload"]))

    def list_runs(self, mission_id: Optional[str] = None) -> List[MissionRunSummary]:
        cur = self._conn.cursor()
        if mission_id is None:
            cur.execute("SELECT payload FROM mission_runs")
        else:
            cur.execute("SELECT payload FROM mission_runs WHERE mission_id = ?", (str(mission_id),))
        rows = [MissionRunSummary(**json.loads(row["payload"])) for row in cur.fetchall()]
        return self._prune_old_runs(rows)


def create_persistence_layer() -> PersistenceLayer:
    dsn = os.getenv("POCKETCORN_MYSQL_DSN")
    if dsn:
        return SQLPersistenceLayer(dsn=dsn)
    return InMemoryPersistenceLayer()
