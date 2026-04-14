"""Dispatches Meridian training jobs to Modal and polls for results."""

from __future__ import annotations

import asyncio
import base64
import hashlib
import os
from datetime import datetime, timezone

from models.database import update_job


async def run_training(job_id: str, csv_bytes: bytes, config: dict) -> None:
    """Background task: dispatch to Modal or use mock results."""

    csv_b64 = base64.b64encode(csv_bytes).decode()

    steps = [
        (10, "validating",   "Preparing your data…"),
        (25, "training",     "Dispatching to GPU (T4)…"),
        (40, "training",     "Running MCMC sampling (NUTS) — hang tight, this takes a few minutes…"),
        (55, "training",     "Estimating channel contributions…"),
        (65, "training",     "Fitting Hill saturation curves…"),
        (75, "training",     "Computing adstock decay weights…"),
        (85, "interpreting", "Running budget optimizer…"),
        (94, "interpreting", "Generating AI insights…"),
    ]

    try:
        use_modal = bool(os.environ.get("MODAL_TOKEN_ID"))

        if use_modal:
            # Real Meridian training on Modal GPU
            import modal

            for progress, status, message in steps[:2]:
                await update_job(job_id, status=status, progress=progress, message=message)
                await asyncio.sleep(0.5)

            await update_job(job_id, status="training", progress=30, message="Running MCMC sampling on GPU…")

            modal_fn = modal.Function.lookup("mktgcompass-meridian", "train_meridian")
            results = await modal_fn.remote.aio(config, csv_b64)

            # Post-training progress steps
            for progress, status, message in steps[5:]:
                await update_job(job_id, status=status, progress=progress, message=message)
                await asyncio.sleep(0.5)
        else:
            # Demo mode: simulate progress with mock results
            for progress, status, message in steps:
                await update_job(job_id, status=status, progress=progress, message=message)
                await asyncio.sleep(2)

            results = _mock_results()

        completed_at = datetime.now(timezone.utc).isoformat()
        await update_job(
            job_id,
            status="complete",
            progress=100,
            message="Your model is ready! Review diagnostics on Model Health.",
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


def _mock_results() -> dict:
    """Return demo dashboard data matching DashboardResults schema (Meridian-aligned)."""
    now = datetime.now()

    return {
        # ── Overview KPIs ────────────────────────────────────────────────
        "overview": {
            "total_revenue": 1_420_850,
            "total_revenue_delta": 12.4,
            "incremental_roi": 3.85,
            "incremental_roi_ci": [2.91, 4.72],
            "model_r_squared": 0.94,
            "incremental_revenue": 576_500,
            "incremental_revenue_ci": [498_200, 661_400],
        },

        # ── Revenue Decomposition (Waterfall) ────────────────────────────
        "waterfall": [
            {"label": "Intercept",       "value": 620_000, "type": "intercept"},
            {"label": "Time Effects",    "value": 89_350,  "type": "time_effects"},
            {"label": "Price Index",     "value": 45_000,  "type": "controls"},
            {"label": "Holiday Flag",    "value": 28_500,  "type": "controls"},
            {"label": "Meta Ads",        "value": 240_000, "type": "channel"},
            {"label": "Google Search",   "value": 155_000, "type": "channel"},
            {"label": "YouTube",         "value": 82_000,  "type": "channel"},
            {"label": "Email",           "value": 61_500,  "type": "channel"},
            {"label": "Display",         "value": 38_000,  "type": "channel"},
            {"label": "Total Revenue",   "value": 1_420_850, "type": "total"},
        ],

        # ── Hill Curves (Response Curves) ────────────────────────────────
        "hill_curves": [
            {
                "channel": "Meta Ads",
                "ec": 35_000,
                "ec_ci": [28_000, 42_000],
                "slope": 1.8,
                "slope_ci": [1.4, 2.3],
                "current_spend": 42_150,
                "curve_points": [
                    {"spend": 0,      "response": 0,      "response_ci_lower": 0,     "response_ci_upper": 0},
                    {"spend": 10_000, "response": 32_000,  "response_ci_lower": 24_000, "response_ci_upper": 41_000},
                    {"spend": 20_000, "response": 108_000, "response_ci_lower": 88_000, "response_ci_upper": 131_000},
                    {"spend": 30_000, "response": 182_000, "response_ci_lower": 152_000, "response_ci_upper": 215_000},
                    {"spend": 35_000, "response": 206_000, "response_ci_lower": 174_000, "response_ci_upper": 242_000},
                    {"spend": 42_150, "response": 235_000, "response_ci_lower": 200_000, "response_ci_upper": 274_000},
                    {"spend": 50_000, "response": 254_000, "response_ci_lower": 218_000, "response_ci_upper": 294_000},
                    {"spend": 60_000, "response": 268_000, "response_ci_lower": 232_000, "response_ci_upper": 308_000},
                    {"spend": 70_000, "response": 276_000, "response_ci_lower": 241_000, "response_ci_upper": 315_000},
                ],
            },
            {
                "channel": "Google Search",
                "ec": 48_000,
                "ec_ci": [38_000, 58_000],
                "slope": 1.4,
                "slope_ci": [1.1, 1.8],
                "current_spend": 31_800,
                "curve_points": [
                    {"spend": 0,      "response": 0,      "response_ci_lower": 0,     "response_ci_upper": 0},
                    {"spend": 10_000, "response": 18_000,  "response_ci_lower": 13_000, "response_ci_upper": 24_000},
                    {"spend": 20_000, "response": 52_000,  "response_ci_lower": 40_000, "response_ci_upper": 66_000},
                    {"spend": 31_800, "response": 98_000,  "response_ci_lower": 78_000, "response_ci_upper": 121_000},
                    {"spend": 40_000, "response": 128_000, "response_ci_lower": 104_000, "response_ci_upper": 156_000},
                    {"spend": 48_000, "response": 152_000, "response_ci_lower": 125_000, "response_ci_upper": 183_000},
                    {"spend": 60_000, "response": 182_000, "response_ci_lower": 152_000, "response_ci_upper": 216_000},
                    {"spend": 70_000, "response": 200_000, "response_ci_lower": 169_000, "response_ci_upper": 236_000},
                    {"spend": 80_000, "response": 214_000, "response_ci_lower": 183_000, "response_ci_upper": 250_000},
                ],
            },
            {
                "channel": "YouTube",
                "ec": 22_000,
                "ec_ci": [16_000, 29_000],
                "slope": 2.1,
                "slope_ci": [1.6, 2.7],
                "current_spend": 18_200,
                "curve_points": [
                    {"spend": 0,      "response": 0,      "response_ci_lower": 0,     "response_ci_upper": 0},
                    {"spend": 5_000,  "response": 6_000,   "response_ci_lower": 4_000,  "response_ci_upper": 9_000},
                    {"spend": 10_000, "response": 22_000,  "response_ci_lower": 16_000, "response_ci_upper": 30_000},
                    {"spend": 15_000, "response": 49_000,  "response_ci_lower": 37_000, "response_ci_upper": 64_000},
                    {"spend": 18_200, "response": 64_000,  "response_ci_lower": 49_000, "response_ci_upper": 82_000},
                    {"spend": 22_000, "response": 78_000,  "response_ci_lower": 61_000, "response_ci_upper": 99_000},
                    {"spend": 30_000, "response": 102_000, "response_ci_lower": 82_000, "response_ci_upper": 126_000},
                    {"spend": 40_000, "response": 118_000, "response_ci_lower": 97_000, "response_ci_upper": 143_000},
                ],
            },
            {
                "channel": "Email",
                "ec": 6_000,
                "ec_ci": [4_200, 8_000],
                "slope": 2.4,
                "slope_ci": [1.8, 3.1],
                "current_spend": 8_400,
                "curve_points": [
                    {"spend": 0,     "response": 0,     "response_ci_lower": 0,     "response_ci_upper": 0},
                    {"spend": 2_000, "response": 8_000,  "response_ci_lower": 5_000,  "response_ci_upper": 12_000},
                    {"spend": 4_000, "response": 28_000, "response_ci_lower": 20_000, "response_ci_upper": 38_000},
                    {"spend": 6_000, "response": 48_000, "response_ci_lower": 36_000, "response_ci_upper": 63_000},
                    {"spend": 8_400, "response": 61_500, "response_ci_lower": 48_000, "response_ci_upper": 78_000},
                    {"spend": 10_000, "response": 68_000, "response_ci_lower": 54_000, "response_ci_upper": 85_000},
                    {"spend": 15_000, "response": 80_000, "response_ci_lower": 65_000, "response_ci_upper": 98_000},
                ],
            },
            {
                "channel": "Display",
                "ec": 15_000,
                "ec_ci": [10_000, 21_000],
                "slope": 1.5,
                "slope_ci": [1.1, 2.0],
                "current_spend": 12_450,
                "curve_points": [
                    {"spend": 0,      "response": 0,      "response_ci_lower": 0,     "response_ci_upper": 0},
                    {"spend": 5_000,  "response": 8_000,   "response_ci_lower": 5_000,  "response_ci_upper": 12_000},
                    {"spend": 10_000, "response": 22_000,  "response_ci_lower": 16_000, "response_ci_upper": 30_000},
                    {"spend": 12_450, "response": 30_000,  "response_ci_lower": 22_000, "response_ci_upper": 40_000},
                    {"spend": 15_000, "response": 36_000,  "response_ci_lower": 27_000, "response_ci_upper": 48_000},
                    {"spend": 20_000, "response": 48_000,  "response_ci_lower": 37_000, "response_ci_upper": 62_000},
                    {"spend": 30_000, "response": 62_000,  "response_ci_lower": 49_000, "response_ci_upper": 78_000},
                ],
            },
        ],

        # ── Channel Efficiency Matrix ────────────────────────────────────
        "efficiency_matrix": [
            {
                "channel": "Email", "channel_type": "Owned Media",
                "spend": 8_400, "roi": 7.32, "roi_ci": [5.71, 9.28],
                "cpik": 18.20, "incremental_outcome": 61_500,
                "grade": "A+", "grade_label": "ELITE",
            },
            {
                "channel": "Meta Ads", "channel_type": "Paid Social",
                "spend": 42_150, "roi": 5.69, "roi_ci": [4.74, 6.50],
                "cpik": 32.10, "incremental_outcome": 240_000,
                "grade": "A+", "grade_label": "ELITE",
            },
            {
                "channel": "Google Search", "channel_type": "Paid Search",
                "spend": 31_800, "roi": 4.87, "roi_ci": [3.62, 6.15],
                "cpik": 38.50, "incremental_outcome": 155_000,
                "grade": "A", "grade_label": "STRONG",
            },
            {
                "channel": "YouTube", "channel_type": "Video",
                "spend": 18_200, "roi": 4.51, "roi_ci": [3.20, 5.95],
                "cpik": 44.10, "incremental_outcome": 82_000,
                "grade": "A", "grade_label": "STRONG",
            },
            {
                "channel": "Display", "channel_type": "Programmatic",
                "spend": 12_450, "roi": 3.05, "roi_ci": [1.97, 4.18],
                "cpik": 61.30, "incremental_outcome": 38_000,
                "grade": "B", "grade_label": "OPTIMAL",
            },
        ],

        # ── Budget Optimization ──────────────────────────────────────────
        "budget_optimization": {
            "total_budget": 113_000,
            "current_allocation": [
                {"channel": "Meta Ads",      "amount": 42_150},
                {"channel": "Google Search", "amount": 31_800},
                {"channel": "YouTube",       "amount": 18_200},
                {"channel": "Email",         "amount": 8_400},
                {"channel": "Display",       "amount": 12_450},
            ],
            "recommended_allocation": [
                {"channel": "Meta Ads",      "amount": 35_000, "delta": -7_150},
                {"channel": "Google Search", "amount": 42_000, "delta": 10_200},
                {"channel": "YouTube",       "amount": 22_000, "delta": 3_800},
                {"channel": "Email",         "amount": 8_000,  "delta": -400},
                {"channel": "Display",       "amount": 6_000,  "delta": -6_450},
            ],
            "projected_lift_pct": 14.2,
            "credible_interval": "90% CI: [8.1%, 21.6%]",
        },

        # ── Insights ─────────────────────────────────────────────────────
        "insights": [
            {
                "id": "1",
                "title": "Google Search has headroom before saturation",
                "body": "Google Search is operating well below its half-saturation point (ec = $48K vs. current $31.8K). The Hill curve shows strong incremental returns through $42K — shifting $10K from Meta could yield an additional $30K in incremental revenue.",
                "action": "Apply to Budget Lab",
                "channel": "Google Search",
                "impact": "+$30K incremental",
                "priority": "high",
            },
            {
                "id": "2",
                "title": "Meta Ads past half-saturation — diminishing returns",
                "body": "Meta's current spend ($42.2K) is above its ec of $35K, meaning you're on the flatter portion of the Hill curve. Each additional dollar generates less incremental outcome. Consider reallocating $7K toward Google Search or YouTube.",
                "action": "View Hill Curve",
                "channel": "Meta Ads",
                "impact": "−$7K reallocation",
                "priority": "high",
            },
            {
                "id": "3",
                "title": "Email delivers the highest ROI",
                "body": "Email has an incremental ROI of 7.32x (90% CI: [5.71x, 9.28x]) — the highest of all channels. Its Hill curve is steep (slope = 2.4) with a low ec ($6K), meaning it saturates fast but is extremely efficient at current spend.",
                "action": None,
                "channel": "Email",
                "impact": "7.32x ROI",
                "priority": "medium",
            },
            {
                "id": "4",
                "title": "YouTube adstock carries over 3+ weeks",
                "body": "YouTube's adstock decay shows meaningful carryover through lag 3 (weight > 0.15), longer than other channels. This suggests its full impact takes weeks to materialize — consider a sustained flight strategy over short bursts.",
                "action": None,
                "channel": "YouTube",
                "impact": "3-week carryover",
                "priority": "medium",
            },
            {
                "id": "5",
                "title": "Display underperforming relative to spend",
                "body": "Display has the lowest ROI (3.05x) and highest CPIK ($61.30). Its wide credible interval [1.97x, 4.18x] indicates high uncertainty — the model isn't confident about Display's true contribution. Consider reducing spend by $6K.",
                "action": "Apply to Budget Lab",
                "channel": "Display",
                "impact": "−$6K savings",
                "priority": "low",
            },
        ],

        # ── Model Health ─────────────────────────────────────────────────
        "model_health": {
            "fit_chart": [
                {"period": "2023-01", "actual": 105_200, "expected": 103_800, "ci_lower": 95_400,  "ci_upper": 112_200},
                {"period": "2023-02", "actual": 98_400,  "expected": 100_100, "ci_lower": 91_800,  "ci_upper": 108_400},
                {"period": "2023-03", "actual": 112_800, "expected": 110_500, "ci_lower": 101_600, "ci_upper": 119_400},
                {"period": "2023-04", "actual": 118_500, "expected": 116_200, "ci_lower": 107_000, "ci_upper": 125_400},
                {"period": "2023-05", "actual": 124_200, "expected": 122_800, "ci_lower": 113_200, "ci_upper": 132_400},
                {"period": "2023-06", "actual": 131_500, "expected": 128_900, "ci_lower": 119_000, "ci_upper": 138_800},
                {"period": "2023-07", "actual": 128_800, "expected": 130_200, "ci_lower": 120_400, "ci_upper": 140_000},
                {"period": "2023-08", "actual": 115_600, "expected": 117_800, "ci_lower": 108_400, "ci_upper": 127_200},
                {"period": "2023-09", "actual": 108_200, "expected": 110_600, "ci_lower": 101_800, "ci_upper": 119_400},
                {"period": "2023-10", "actual": 122_400, "expected": 120_800, "ci_lower": 111_400, "ci_upper": 130_200},
                {"period": "2023-11", "actual": 135_800, "expected": 133_200, "ci_lower": 123_200, "ci_upper": 143_200},
                {"period": "2023-12", "actual": 142_200, "expected": 139_800, "ci_lower": 129_400, "ci_upper": 150_200},
            ],
            "fit_metrics": {
                "r_squared": 0.94,
                "mape": 2.1,
                "wmape": 1.8,
            },
            "convergence": [
                {"parameter": "intercept",       "rhat": 1.01, "status": "converged"},
                {"parameter": "beta_media[0]",   "rhat": 1.02, "status": "converged"},
                {"parameter": "beta_media[1]",   "rhat": 1.03, "status": "converged"},
                {"parameter": "beta_media[2]",   "rhat": 1.01, "status": "converged"},
                {"parameter": "hill_ec",         "rhat": 1.04, "status": "converged"},
                {"parameter": "hill_slope",      "rhat": 1.02, "status": "converged"},
                {"parameter": "adstock_alpha",   "rhat": 1.06, "status": "converged"},
            ],
            "convergence_status": "converged",
        },

        # ── Adstock Decay ────────────────────────────────────────────────
        "adstock_decay": [
            {
                "channel": "Meta Ads",
                "decay_weights": [
                    {"lag": 0, "weight": 1.0,  "ci_lower": 1.0,  "ci_upper": 1.0},
                    {"lag": 1, "weight": 0.62, "ci_lower": 0.48, "ci_upper": 0.74},
                    {"lag": 2, "weight": 0.38, "ci_lower": 0.23, "ci_upper": 0.55},
                    {"lag": 3, "weight": 0.24, "ci_lower": 0.11, "ci_upper": 0.41},
                    {"lag": 4, "weight": 0.15, "ci_lower": 0.05, "ci_upper": 0.30},
                    {"lag": 5, "weight": 0.09, "ci_lower": 0.02, "ci_upper": 0.22},
                    {"lag": 6, "weight": 0.06, "ci_lower": 0.01, "ci_upper": 0.16},
                    {"lag": 7, "weight": 0.03, "ci_lower": 0.00, "ci_upper": 0.12},
                ],
            },
            {
                "channel": "Google Search",
                "decay_weights": [
                    {"lag": 0, "weight": 1.0,  "ci_lower": 1.0,  "ci_upper": 1.0},
                    {"lag": 1, "weight": 0.45, "ci_lower": 0.32, "ci_upper": 0.58},
                    {"lag": 2, "weight": 0.20, "ci_lower": 0.10, "ci_upper": 0.34},
                    {"lag": 3, "weight": 0.09, "ci_lower": 0.03, "ci_upper": 0.20},
                    {"lag": 4, "weight": 0.04, "ci_lower": 0.01, "ci_upper": 0.11},
                    {"lag": 5, "weight": 0.02, "ci_lower": 0.00, "ci_upper": 0.07},
                    {"lag": 6, "weight": 0.01, "ci_lower": 0.00, "ci_upper": 0.04},
                    {"lag": 7, "weight": 0.00, "ci_lower": 0.00, "ci_upper": 0.02},
                ],
            },
            {
                "channel": "YouTube",
                "decay_weights": [
                    {"lag": 0, "weight": 1.0,  "ci_lower": 1.0,  "ci_upper": 1.0},
                    {"lag": 1, "weight": 0.72, "ci_lower": 0.58, "ci_upper": 0.84},
                    {"lag": 2, "weight": 0.52, "ci_lower": 0.34, "ci_upper": 0.71},
                    {"lag": 3, "weight": 0.37, "ci_lower": 0.20, "ci_upper": 0.59},
                    {"lag": 4, "weight": 0.27, "ci_lower": 0.11, "ci_upper": 0.50},
                    {"lag": 5, "weight": 0.19, "ci_lower": 0.06, "ci_upper": 0.41},
                    {"lag": 6, "weight": 0.14, "ci_lower": 0.04, "ci_upper": 0.34},
                    {"lag": 7, "weight": 0.10, "ci_lower": 0.02, "ci_upper": 0.28},
                ],
            },
            {
                "channel": "Email",
                "decay_weights": [
                    {"lag": 0, "weight": 1.0,  "ci_lower": 1.0,  "ci_upper": 1.0},
                    {"lag": 1, "weight": 0.35, "ci_lower": 0.22, "ci_upper": 0.50},
                    {"lag": 2, "weight": 0.12, "ci_lower": 0.05, "ci_upper": 0.25},
                    {"lag": 3, "weight": 0.04, "ci_lower": 0.01, "ci_upper": 0.13},
                    {"lag": 4, "weight": 0.02, "ci_lower": 0.00, "ci_upper": 0.06},
                    {"lag": 5, "weight": 0.01, "ci_lower": 0.00, "ci_upper": 0.03},
                    {"lag": 6, "weight": 0.00, "ci_lower": 0.00, "ci_upper": 0.01},
                    {"lag": 7, "weight": 0.00, "ci_lower": 0.00, "ci_upper": 0.01},
                ],
            },
        ],

        # ── Contributions Over Time ──────────────────────────────────────
        "contributions_over_time": [
            {"period": "Q1 2023", "baseline": 310_000, "Meta Ads": 55_000,  "Google Search": 34_000,  "YouTube": 18_000, "Email": 14_000, "Display": 8_000},
            {"period": "Q2 2023", "baseline": 325_000, "Meta Ads": 62_000,  "Google Search": 40_000,  "YouTube": 22_000, "Email": 16_000, "Display": 10_000},
            {"period": "Q3 2023", "baseline": 308_000, "Meta Ads": 58_000,  "Google Search": 38_000,  "YouTube": 19_000, "Email": 15_000, "Display": 9_000},
            {"period": "Q4 2023", "baseline": 340_000, "Meta Ads": 65_000,  "Google Search": 43_000,  "YouTube": 23_000, "Email": 16_500, "Display": 11_000},
        ],

        # ── Meta ─────────────────────────────────────────────────────────
        "model_run_date": now.strftime("%B %d, %Y"),
        "data_period": "Jan 2023 — Dec 2023",
    }
