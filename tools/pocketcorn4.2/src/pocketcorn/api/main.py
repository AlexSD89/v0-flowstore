from __future__ import annotations

from typing import Any, Dict, Optional, Literal

import os
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from pocketcorn.api import missions
from pocketcorn.collectors.mission_orchestrator import MissionOrchestrator
from pocketcorn.collectors.registry import CollectorRegistry
from pocketcorn.collectors.scheduler import MissionScheduler
from pocketcorn.mission_tracking.mission_repository import MissionRepository


class MissionCreateRequest(BaseModel):
    name: str = Field(..., description="Human readable mission name")
    description: Optional[str] = Field(None, description="Natural language mission brief")
    criteria: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Structured criteria overrides (industry, geography, revenue_threshold, ...)",
    )
    schedule: Optional[Dict[str, Any]] = Field(default=None, description="Scheduling metadata")
    priority: str = Field(default="standard", description="Mission priority tier")
    notification_channel: Optional[str] = Field(
        default=None, description="Optional notification channel for mission updates"
    )
    analyst_id: Optional[str] = Field(default=None, description="Analyst identifier authoring the mission")


class MissionRunRequest(BaseModel):
    mode: Literal["on-demand", "scheduled"] = "on-demand"
    override_criteria: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Temporary criteria overrides applied only for this run",
    )
    requested_by: str = Field(default="api", description="Caller identity triggering the run")


def create_app() -> FastAPI:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        repository = MissionRepository()
        registry = CollectorRegistry()
        registry.bootstrap_default_adapters()
        orchestrator = MissionOrchestrator(repository=repository, collector_registry=registry)
        scheduler_interval = int(os.getenv("POCKETCORN_SCHEDULER_INTERVAL", "300"))
        scheduler = MissionScheduler(
            repository=repository,
            orchestrator=orchestrator,
            interval_seconds=scheduler_interval,
        )
        enable_scheduler = os.getenv("POCKETCORN_ENABLE_SCHEDULER", "false").lower() in {"1", "true", "yes"}

        setattr(app.state, "repository", repository)
        setattr(app.state, "orchestrator", orchestrator)
        setattr(app.state, "collector_registry", registry)
        setattr(app.state, "scheduler", scheduler)
        setattr(app.state, "scheduler_enabled", enable_scheduler)

        if enable_scheduler:
            await scheduler.start()

        try:
            yield
        finally:
            if enable_scheduler:
                await scheduler.stop()
            setattr(app.state, "repository", None)
            setattr(app.state, "orchestrator", None)
            setattr(app.state, "collector_registry", None)
            setattr(app.state, "scheduler", None)

    app = FastAPI(
        title="Pocketcorn Mission Collector API",
        description="Exposes mission lifecycle endpoints for Pocketcorn v4.2",
        version="4.2.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    def get_repository() -> MissionRepository:
        repository = getattr(app.state, "repository", None)
        if repository is None:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Repository not initialised")
        return repository

    def get_orchestrator() -> MissionOrchestrator:
        orchestrator = getattr(app.state, "orchestrator", None)
        if orchestrator is None:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Orchestrator not initialised")
        return orchestrator

    @app.get("/health")
    def health() -> Dict[str, str]:
        return {"status": "ok"}

    @app.post("/missions", status_code=status.HTTP_201_CREATED)
    def create_mission_endpoint(
        payload: MissionCreateRequest,
        repository: MissionRepository = Depends(get_repository),
    ) -> Dict[str, Any]:
        body = payload.model_dump(exclude_none=True)
        try:
            return missions.create_mission(body, repository=repository)
        except ValueError as exc:
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc

    @app.post("/missions/{mission_id}/run", status_code=status.HTTP_202_ACCEPTED)
    def run_mission_endpoint(
        mission_id: str,
        payload: MissionRunRequest,
        orchestrator: MissionOrchestrator = Depends(get_orchestrator),
    ) -> Dict[str, Any]:
        try:
            return missions.run_mission(
                mission_id=mission_id,
                mode=payload.mode,
                requested_by=payload.requested_by,
                orchestrator=orchestrator,
                override_criteria=payload.override_criteria,
            )
        except KeyError as exc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    @app.get("/missions/runs/{run_id}")
    def get_run_endpoint(
        run_id: str,
        repository: MissionRepository = Depends(get_repository),
    ) -> Dict[str, Any]:
        try:
            return missions.get_mission_run(run_id, repository=repository)
        except KeyError as exc:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    return app


app = create_app()

__all__ = ["create_app", "app"]
