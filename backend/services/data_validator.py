"""Data validation pipeline for MMM readiness.

Checks run in order: schema → completeness → quality → Meridian readiness.
All feedback is written for non-technical marketers.
"""

from __future__ import annotations

import re
from datetime import datetime, timedelta
from typing import Optional

import numpy as np
import pandas as pd

from models.schemas import DataSummary, ValidationIssue, ValidationResult


# ── Helpers ──────────────────────────────────────────────────────────────────

def _clean_numeric(series: pd.Series) -> pd.Series:
    """Strip $, commas, and whitespace from a column; return as float."""
    return (
        series.astype(str)
        .str.replace(r"[$,\s]", "", regex=True)
        .str.strip()
        .replace("", np.nan)
        .astype(float)
    )


def _is_likely_date(series: pd.Series) -> bool:
    sample = series.dropna().head(5).astype(str)
    formats = ["%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%Y/%m/%d", "%b %Y", "%B %Y"]
    for val in sample:
        for fmt in formats:
            try:
                datetime.strptime(val.strip(), fmt)
                return True
            except ValueError:
                continue
    return False


def _detect_date_column(df: pd.DataFrame) -> Optional[str]:
    candidates = [c for c in df.columns if any(k in c.lower() for k in ("date", "week", "month", "time", "period"))]
    if candidates:
        return candidates[0]
    for col in df.columns:
        if _is_likely_date(df[col]):
            return col
    return None


def _detect_kpi_column(df: pd.DataFrame) -> Optional[str]:
    candidates = [c for c in df.columns if any(k in c.lower() for k in ("revenue", "sales", "conversion", "order", "kpi", "target"))]
    return candidates[0] if candidates else None


def _detect_spend_columns(df: pd.DataFrame, exclude: list[str]) -> list[str]:
    return [
        c for c in df.columns
        if c not in exclude and any(k in c.lower() for k in ("spend", "cost", "budget", "invest"))
    ]


# ── Step 1: Schema ────────────────────────────────────────────────────────────

def validate_schema(df: pd.DataFrame) -> tuple[list[ValidationIssue], dict]:
    issues: list[ValidationIssue] = []
    ctx: dict = {}

    # Strip BOM and whitespace from column names
    df.columns = [c.strip().lstrip("\ufeff") for c in df.columns]

    # Duplicate columns
    dupes = df.columns[df.columns.duplicated()].tolist()
    if dupes:
        issues.append(ValidationIssue(
            severity="error", category="schema",
            what=f"Duplicate column names found: {', '.join(dupes)}",
            why="Each column must have a unique name so the model can tell channels apart.",
            fix="Rename or remove duplicate columns in your spreadsheet.",
        ))

    # Date column
    date_col = _detect_date_column(df)
    if date_col is None:
        issues.append(ValidationIssue(
            severity="error", category="schema",
            what="No date column found",
            why="The model needs to understand how your data changes over time.",
            fix="Add a column named 'week', 'month', or 'date' with your time periods.",
        ))
    else:
        ctx["date_col"] = date_col

    # KPI column
    kpi_col = _detect_kpi_column(df)
    if kpi_col is None:
        issues.append(ValidationIssue(
            severity="error", category="schema",
            what="No revenue or KPI column found",
            why="The model needs a target metric (revenue, conversions, etc.) to explain.",
            fix="Add a column named 'revenue', 'sales', or 'conversions'.",
        ))
    else:
        ctx["kpi_col"] = kpi_col

    # Spend columns
    exclude = [date_col, kpi_col] if date_col and kpi_col else []
    spend_cols = _detect_spend_columns(df, exclude)
    if len(spend_cols) < 2:
        issues.append(ValidationIssue(
            severity="error", category="schema",
            what=f"Only {len(spend_cols)} spend column(s) detected",
            why="MMM needs at least 2 media channels to compare and decompose effects.",
            fix="Add spend columns for each marketing channel (e.g., paid_search_spend, social_spend).",
        ))
    else:
        ctx["spend_cols"] = spend_cols

    # Clean numeric columns
    for col in spend_cols + ([kpi_col] if kpi_col else []):
        if col in df.columns and df[col].dtype == object:
            df[col] = _clean_numeric(df[col])

    return issues, ctx


# ── Step 2: Completeness ──────────────────────────────────────────────────────

def validate_completeness(df: pd.DataFrame, ctx: dict) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    n = len(df)

    if n < 26:
        issues.append(ValidationIssue(
            severity="error", category="completeness",
            what=f"Your dataset has only {n} rows of data",
            why="MMM needs at least 6 months of data to separate channel effects from random noise. With less, the model can't tell if a spike was caused by your ads or just a seasonal trend.",
            fix="Gather at least 26 weeks (6 months) of data. 52+ weeks is ideal.",
        ))
    elif n < 52:
        issues.append(ValidationIssue(
            severity="warning", category="completeness",
            what=f"Your dataset has {n} rows — less than the ideal 52 weeks",
            why="A full year of data lets the model account for seasonal patterns. With less, some seasonal effects may be incorrectly attributed to your marketing.",
            fix="Add more historical data if available. The model will still run, but treat results with more caution.",
        ))
    elif n < 104:
        issues.append(ValidationIssue(
            severity="info", category="completeness",
            what=f"Your dataset has {n} weeks. Two years (104+) gives the most reliable estimates.",
            why="More data = tighter confidence intervals and better seasonal modeling.",
            fix="No action needed — just something to keep in mind as you collect more data over time.",
        ))

    # Missing values
    for col in df.columns:
        missing_pct = df[col].isna().mean() * 100
        if missing_pct > 10:
            issues.append(ValidationIssue(
                severity="warning", category="completeness",
                what=f"Column '{col}' is {missing_pct:.0f}% empty",
                why="Missing values force the model to guess what happened in those periods, which reduces accuracy.",
                fix=f"Fill in the gaps in '{col}', or replace them with zeros if there was genuinely no activity.",
                column=col,
            ))

    # All-zero spend columns
    if "spend_cols" in ctx:
        for col in ctx["spend_cols"]:
            if col in df.columns and df[col].fillna(0).sum() == 0:
                issues.append(ValidationIssue(
                    severity="warning", category="completeness",
                    what=f"Column '{col}' is all zeros",
                    why="A channel with no spend can't be measured.",
                    fix=f"Remove '{col}' if you didn't run this channel, or check if the values are in a different column.",
                    column=col,
                ))

    return issues


# ── Step 3: Quality ───────────────────────────────────────────────────────────

def validate_quality(df: pd.DataFrame, ctx: dict) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []

    spend_cols = ctx.get("spend_cols", [])
    numeric_spend = [c for c in spend_cols if c in df.columns and pd.api.types.is_numeric_dtype(df[c])]

    if len(numeric_spend) >= 2:
        corr = df[numeric_spend].corr()
        for i, c1 in enumerate(numeric_spend):
            for c2 in numeric_spend[i + 1:]:
                r = corr.loc[c1, c2]
                if abs(r) > 0.85:
                    issues.append(ValidationIssue(
                        severity="warning", category="quality",
                        what=f"'{c1}' and '{c2}' are highly correlated (r={r:.2f})",
                        why="When two channels always go up and down together, the model struggles to figure out which one is actually driving results — like trying to credit either the drums or bass when they always play the same rhythm.",
                        fix="The model will still run, but ROI estimates for these two channels will be less precise. Look for periods where you changed one without the other.",
                        column=c1,
                    ))

    # Zero-variance channels
    for col in numeric_spend:
        if col in df.columns and df[col].dropna().std() == 0:
            issues.append(ValidationIssue(
                severity="warning", category="quality",
                what=f"'{col}' spend never changes — it's the same every period",
                why="The model learns by observing how results change when spending changes. A channel with constant spend teaches the model nothing.",
                fix="Check if this channel's spend is being tracked correctly. If you always spend the same amount, consider excluding it from the analysis.",
                column=col,
            ))

    # Outliers
    kpi_col = ctx.get("kpi_col")
    if kpi_col and kpi_col in df.columns and pd.api.types.is_numeric_dtype(df[kpi_col]):
        mean, std = df[kpi_col].mean(), df[kpi_col].std()
        n_outliers = (abs(df[kpi_col] - mean) > 3 * std).sum()
        if n_outliers > 0:
            issues.append(ValidationIssue(
                severity="info", category="quality",
                what=f"{n_outliers} revenue value(s) are unusually high or low (outliers)",
                why="Extreme values can distort the model's understanding of normal performance.",
                fix="Review those weeks to see if they represent real events (product launches, viral moments) or data errors. Real events are fine — just be aware they'll influence the model.",
                column=kpi_col,
            ))

    return issues


# ── Step 4: Meridian readiness ────────────────────────────────────────────────

def validate_meridian_readiness(df: pd.DataFrame, ctx: dict) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []

    # Control variables
    control_keywords = ("holiday", "season", "promo", "promotion", "price", "competitor", "event")
    has_controls = any(
        any(k in c.lower() for k in control_keywords) for c in df.columns
    )
    if not has_controls:
        issues.append(ValidationIssue(
            severity="info", category="readiness",
            what="No control variables detected (seasonality, pricing, promotions)",
            why="Control variables help the model account for things that affect revenue but aren't marketing — like holiday seasons, price changes, or competitor activity. Without them, some effects might get incorrectly attributed to your channels.",
            fix="Consider adding columns like: is_holiday (0/1), month_of_year (1–12), price_index, or competitor_activity.",
        ))

    # Future dates
    date_col = ctx.get("date_col")
    if date_col and date_col in df.columns:
        try:
            dates = pd.to_datetime(df[date_col], errors="coerce")
            future = (dates > datetime.now() + timedelta(days=7)).sum()
            if future > 0:
                issues.append(ValidationIssue(
                    severity="warning", category="readiness",
                    what=f"{future} row(s) have dates in the future",
                    why="The model is trained on historical data — future rows have no actual outcomes to learn from.",
                    fix="Remove rows with future dates, or check if the dates are entered correctly.",
                    column=date_col,
                ))
        except Exception:
            pass

    return issues


# ── Main entry point ──────────────────────────────────────────────────────────

def run_validation(df: pd.DataFrame) -> ValidationResult:
    all_issues: list[ValidationIssue] = []

    schema_issues, ctx = validate_schema(df)
    all_issues.extend(schema_issues)

    # Only continue deeper checks if schema is basically sound
    if not any(i.severity == "error" for i in schema_issues):
        all_issues.extend(validate_completeness(df, ctx))
        all_issues.extend(validate_quality(df, ctx))
        all_issues.extend(validate_meridian_readiness(df, ctx))

    has_errors = any(i.severity == "error" for i in all_issues)
    has_warnings = any(i.severity == "warning" for i in all_issues)

    status = "errors" if has_errors else ("warnings" if has_warnings else "pass")

    # Build data summary
    kpi_col = ctx.get("kpi_col")
    spend_cols = ctx.get("spend_cols", [])
    date_col = ctx.get("date_col")

    try:
        dates = pd.to_datetime(df[date_col], errors="coerce") if date_col else None
        date_range = (
            f"{dates.min().strftime('%b %Y')} — {dates.max().strftime('%b %Y')}"
            if dates is not None and not dates.isna().all()
            else "Unknown"
        )
    except Exception:
        date_range = "Unknown"

    summary = DataSummary(
        row_count=len(df),
        column_count=len(df.columns),
        date_range=date_range,
        channels_detected=[c.replace("_spend", "").replace("_", " ").title() for c in spend_cols],
        kpi_column=kpi_col or "unknown",
        total_spend=float(df[spend_cols].sum().sum()) if spend_cols else 0.0,
        total_kpi=float(df[kpi_col].sum()) if kpi_col and kpi_col in df.columns else 0.0,
    )

    return ValidationResult(
        status=status,
        can_proceed=not has_errors,
        issues=all_issues,
        data_summary=summary,
    )
