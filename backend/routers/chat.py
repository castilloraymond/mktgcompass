"""POST /api/chat — streaming Claude response with MMM context."""

from __future__ import annotations

import os

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from models.database import get_job
from models.schemas import ChatRequest
from services.chat_agent import stream_response

router = APIRouter()


@router.post("/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    # Load model results for context if job_id provided
    results = None
    if req.job_id:
        job = await get_job(req.job_id)
        if job and job.get("results"):
            results = job["results"]

    async def generate():
        async for chunk in stream_response(req.message, req.history, results):
            yield chunk

    return StreamingResponse(generate(), media_type="text/plain")
