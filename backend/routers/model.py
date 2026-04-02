"""Model training, status polling, and results retrieval."""

from __future__ import annotations

import io
import uuid
from datetime import datetime, timezone

import pandas as pd
from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile

from models.database import create_job, get_job
from models.schemas import DashboardResults, TrainRequest, TrainingJob
from services.meridian_runner import run_training

router = APIRouter()


@router.post("/train")
async def start_training(req: TrainRequest, background_tasks: BackgroundTasks) -> dict:
    """Kick off Meridian model training for a job."""
    # For demo: accept job_id without stored CSV (use mock data)
    job = await get_job(req.job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found. Upload a CSV first.")

    # Dispatch background task
    background_tasks.add_task(run_training, req.job_id, b"", req.config)
    return {"job_id": req.job_id, "message": "Training started"}


@router.get("/status/{job_id}", response_model=TrainingJob)
async def get_status(job_id: str) -> TrainingJob:
    job = await get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return TrainingJob(
        job_id=job["job_id"],
        status=job["status"],
        progress_pct=job["progress"],
        message=job["message"],
        created_at=job["created_at"],
        completed_at=job.get("completed_at"),
        error=job.get("error"),
    )


@router.get("/results/{job_id}", response_model=DashboardResults)
async def get_results(job_id: str) -> DashboardResults:
    job = await get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["status"] != "complete":
        raise HTTPException(status_code=202, detail=f"Model is still running: {job['status']}")
    if not job.get("results"):
        raise HTTPException(status_code=500, detail="Results missing — please re-run the model")
    return DashboardResults(**job["results"])
