"""MktgCompass FastAPI backend entry point."""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.database import init_db
from routers import chat, model, upload

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="MktgCompass API",
    description="AI-powered Marketing Mix Modeling backend",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow Vercel frontend + local dev
origins = [
    "http://localhost:3000",
    "https://mktgcompass.com",
    "https://www.mktgcompass.com",
    os.environ.get("FRONTEND_URL", ""),
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(model.router,  prefix="/api", tags=["model"])
app.include_router(chat.router,   prefix="/api", tags=["chat"])


@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "service": "mktgcompass-api"}
