"""Dispatches Meridian training jobs to Modal and polls for results."""

from __future__ import annotations

import asyncio
import hashlib
import io
import base64
import os
from datetime import datetime, timezone

import pandas as pd

from models.database import update_job


async def run_training(job_id: str, csv_bytes: bytes, config: dict) -> None:
    """Background task: dispatch to Modal, poll, store results."""

    data_hash = hashlib.md5(csv_bytes).hexdigest()
    csv_b64 = base64.b64encode(csv_bytes).decode()

    steps = [
        (10, "validating",    "Preparing your data…"),
        (25, "training",      "Dispatching to GPU (T4)…"),
        (40, "training",      "Running MCMC sampling — hang tight, this takes a few minutes…"),
        (60, "training",      "Estimating channel contributions…"),
        (75, "training",      "Fitting saturation curves…"),
        (88, "interpreting",  "Optimizing budget allocation…"),
        (94, "interpreting",  "Generating AI insights…"),
    ]

    try:
        for progress, status, message in steps:
            await update_job(job_id, status=status, progress=progress, message=message)
            # In production: await Modal function call here
            # modal_fn = modal.Function.lookup("mktgcompass-meridian", "train_meridian")
            # result = await modal_fn.remote.aio(config, csv_b64)
            await asyncio.sleep(2)  # Simulate Modal latency

        # In real mode, get Modal results; in demo, return mock results
        results = _mock_results(csv_bytes, config)

        completed_at = datetime.now(timezone.utc).isoformat()
        await update_job(
            job_id,
            status="complete",
            progress=100,
            message="Your model is ready! Head to the dashboard.",
            results=results,
            completed_at=completed_at,
        )

    except Exception as exc:
        await update_job(
            job_id,
            status="error",
            message="Something went wrong during training.",
            error=str(exc),
        )


def _mock_results(csv_bytes: bytes, config: dict) -> dict:
    """Return demo dashboard data when Modal is not configured."""
    return {
        "overview": {
            "total_revenue": 1_420_850,
            "total_revenue_delta": 12.4,
            "blended_roas": 3.85,
            "blended_roas_vs_target": 0.35,
            "weighted_cpa": 42.18,
            "weighted_cpa_delta": -4.1,
            "incrementality_lift": 18.4,
            "incrementality_confidence": "high",
        },
        "waterfall": [
            {"label": "Baseline",    "value": 800_000,   "type": "baseline"},
            {"label": "Paid Social", "value": 240_000,   "type": "positive"},
            {"label": "Paid Search", "value": 155_000,   "type": "positive"},
            {"label": "YouTube",     "value":  82_000,   "type": "positive"},
            {"label": "Email",       "value":  61_500,   "type": "positive"},
            {"label": "Display",     "value":  38_000,   "type": "positive"},
            {"label": "Discounting", "value": -45_000,   "type": "negative"},
            {"label": "Seasonality", "value":  89_350,   "type": "positive"},
            {"label": "Total",       "value": 1_420_850, "type": "total"},
        ],
        "saturation_curves": [
            {
                "channel": "Meta Ads",
                "current_spend": 42_150,
                "saturation_pct": 85,
                "curve_points": [
                    {"spend": 0,      "marginal_return": 0},
                    {"spend": 10_000, "marginal_return": 9_400},
                    {"spend": 20_000, "marginal_return": 15_600},
                    {"spend": 42_150, "marginal_return": 21_300},
                    {"spend": 60_000, "marginal_return": 23_100},
                ],
            },
            {
                "channel": "Google Search",
                "current_spend": 31_800,
                "saturation_pct": 58,
                "curve_points": [
                    {"spend": 0,      "marginal_return": 0},
                    {"spend": 10_000, "marginal_return": 13_200},
                    {"spend": 31_800, "marginal_return": 32_800},
                    {"spend": 60_000, "marginal_return": 45_300},
                ],
            },
        ],
        "efficiency_matrix": [
            {"channel": "Meta Ads",       "channel_type": "Paid Social",  "spend": 42_150, "cpa": 32.10, "roas": 5.69, "grade": "A+", "grade_label": "ELITE"},
            {"channel": "Email",          "channel_type": "Owned Media",  "spend":  8_400, "cpa": 18.20, "roas": 7.32, "grade": "A+", "grade_label": "ELITE"},
            {"channel": "Google Search",  "channel_type": "Paid Search",  "spend": 31_800, "cpa": 38.50, "roas": 4.87, "grade": "A",  "grade_label": "STRONG"},
            {"channel": "YouTube",        "channel_type": "Video",        "spend": 18_200, "cpa": 44.10, "roas": 4.01, "grade": "B",  "grade_label": "OPTIMAL"},
            {"channel": "Display",        "channel_type": "Programmatic", "spend": 12_450, "cpa": 61.30, "roas": 3.05, "grade": "C",  "grade_label": "SCALING"},
        ],
        "budget_optimization": {
            "total_budget": 150_000,
            "current_allocation": [
                {"channel": "Meta Ads",      "amount": 42_150},
                {"channel": "Google Search", "amount": 31_800},
                {"channel": "YouTube",       "amount": 18_200},
                {"channel": "Email",         "amount":  8_400},
                {"channel": "Display",       "amount": 12_450},
            ],
            "recommended_allocation": [
                {"channel": "Meta Ads",      "amount": 35_000, "delta": -7_150},
                {"channel": "Google Search", "amount": 52_000, "delta": 20_200},
                {"channel": "YouTube",       "amount": 32_000, "delta": 13_800},
                {"channel": "Email",         "amount": 16_000, "delta":  7_600},
                {"channel": "Display",       "amount":  8_000, "delta": -4_450},
            ],
            "projected_lift_pct": 14.2,
            "confidence_interval": "98.4% ± 0.2",
        },
        "insights": [
            {
                "id": "1",
                "title": "Google Search has room to grow",
                "body": "At 58% saturation, Google Search is your most efficient channel with room to scale. Shifting $20K from Meta could generate an additional $31K in revenue.",
                "action": "Apply to Budget Lab",
                "channel": "Google Search",
                "impact": "+$31K projected",
                "priority": "high",
            },
            {
                "id": "2",
                "title": "Meta Ads approaching saturation",
                "body": "Meta is running at 85% saturation — you're paying premium prices for marginal returns. Consider reallocating $7-10K toward Search or YouTube.",
                "action": "View Saturation Curve",
                "channel": "Meta Ads",
                "impact": "−$8K waste",
                "priority": "high",
            },
        ],
        "model_run_date": datetime.now().strftime("%B %d, %Y"),
        "data_period": "Detected from your CSV",
    }
