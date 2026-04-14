"""POST /api/upload — accept CSV, validate, create training job."""

from __future__ import annotations

import base64
import hashlib
import io
import uuid
from datetime import datetime, timezone

import pandas as pd
from fastapi import APIRouter, BackgroundTasks, HTTPException, UploadFile

from models.database import create_job
from models.schemas import UploadResponse
from services.data_validator import run_validation

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_csv(file: UploadFile, background_tasks: BackgroundTasks) -> UploadResponse:
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    contents = await file.read()
    if len(contents) > 50 * 1024 * 1024:  # 50 MB cap
        raise HTTPException(status_code=413, detail="File too large. Max 50 MB.")

    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Couldn't parse CSV: {exc}") from exc

    validation = run_validation(df)

    job_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    data_hash = hashlib.md5(contents).hexdigest()
    csv_b64 = base64.b64encode(contents).decode()

    await create_job(job_id, created_at, data_hash=data_hash, csv_data=csv_b64)

    return UploadResponse(job_id=job_id, validation=validation)
