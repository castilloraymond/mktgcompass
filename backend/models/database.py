"""SQLite job state management using aiosqlite."""

from __future__ import annotations

import json
import aiosqlite
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "mktgcompass.db"


async def init_db() -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                job_id      TEXT PRIMARY KEY,
                status      TEXT NOT NULL DEFAULT 'pending',
                progress    INTEGER NOT NULL DEFAULT 0,
                message     TEXT NOT NULL DEFAULT '',
                data_hash   TEXT,
                results     TEXT,
                error       TEXT,
                created_at  TEXT NOT NULL,
                completed_at TEXT
            )
        """)
        await db.commit()


async def create_job(job_id: str, created_at: str, data_hash: str | None = None) -> None:
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO jobs (job_id, created_at, data_hash) VALUES (?, ?, ?)",
            (job_id, created_at, data_hash),
        )
        await db.commit()


async def update_job(
    job_id: str,
    status: str | None = None,
    progress: int | None = None,
    message: str | None = None,
    results: dict | None = None,
    error: str | None = None,
    completed_at: str | None = None,
) -> None:
    fields: list[str] = []
    values: list = []

    if status      is not None: fields.append("status = ?");       values.append(status)
    if progress    is not None: fields.append("progress = ?");      values.append(progress)
    if message     is not None: fields.append("message = ?");       values.append(message)
    if results     is not None: fields.append("results = ?");       values.append(json.dumps(results))
    if error       is not None: fields.append("error = ?");         values.append(error)
    if completed_at is not None: fields.append("completed_at = ?"); values.append(completed_at)

    if not fields:
        return

    values.append(job_id)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(f"UPDATE jobs SET {', '.join(fields)} WHERE job_id = ?", values)
        await db.commit()


async def get_job(job_id: str) -> dict | None:
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM jobs WHERE job_id = ?", (job_id,)) as cursor:
            row = await cursor.fetchone()
            if row is None:
                return None
            d = dict(row)
            if d.get("results"):
                d["results"] = json.loads(d["results"])
            return d
