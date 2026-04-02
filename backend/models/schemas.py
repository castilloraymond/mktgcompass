"""Pydantic v2 schemas for all API request/response models."""

from __future__ import annotations

from typing import Literal, Optional
from pydantic import BaseModel, Field


# ── Validation ───────────────────────────────────────────────────────────────

class ValidationIssue(BaseModel):
    severity: Literal["error", "warning", "info"]
    category: Literal["schema", "completeness", "quality", "readiness"]
    what: str
    why: str
    fix: str
    column: Optional[str] = None


class DataSummary(BaseModel):
    row_count: int
    column_count: int
    date_range: str
    channels_detected: list[str]
    kpi_column: str
    total_spend: float
    total_kpi: float


class ValidationResult(BaseModel):
    status: Literal["pass", "warnings", "errors"]
    can_proceed: bool
    issues: list[ValidationIssue]
    data_summary: DataSummary


# ── Jobs ─────────────────────────────────────────────────────────────────────

class TrainingJob(BaseModel):
    job_id: str
    status: Literal["pending", "validating", "training", "interpreting", "complete", "error"]
    progress_pct: int = 0
    message: str = ""
    created_at: str
    completed_at: Optional[str] = None
    error: Optional[str] = None


class UploadResponse(BaseModel):
    job_id: str
    validation: ValidationResult


class TrainRequest(BaseModel):
    job_id: str
    config: dict = Field(default_factory=dict)


# ── Dashboard Data ────────────────────────────────────────────────────────────

class OverviewMetrics(BaseModel):
    total_revenue: float
    total_revenue_delta: float
    blended_roas: float
    blended_roas_vs_target: float
    weighted_cpa: float
    weighted_cpa_delta: float
    incrementality_lift: float
    incrementality_confidence: Literal["high", "medium", "low"]


class WaterfallItem(BaseModel):
    label: str
    value: float
    type: Literal["baseline", "positive", "negative", "total"]


class SaturationCurvePoint(BaseModel):
    spend: float
    marginal_return: float


class SaturationChannel(BaseModel):
    channel: str
    current_spend: float
    saturation_pct: float
    curve_points: list[SaturationCurvePoint]


class ChannelEfficiency(BaseModel):
    channel: str
    channel_type: str
    spend: float
    cpa: float
    roas: float
    grade: Literal["A+", "A", "B", "C", "D"]
    grade_label: Literal["ELITE", "STRONG", "OPTIMAL", "SCALING", "POOR"]


class BudgetAllocation(BaseModel):
    channel: str
    amount: float
    delta: Optional[float] = None


class BudgetOptimization(BaseModel):
    total_budget: float
    current_allocation: list[BudgetAllocation]
    recommended_allocation: list[BudgetAllocation]
    projected_lift_pct: float
    confidence_interval: str


class InsightCard(BaseModel):
    id: str
    title: str
    body: str
    action: Optional[str] = None
    channel: Optional[str] = None
    impact: Optional[str] = None
    priority: Literal["high", "medium", "low"]


class DashboardResults(BaseModel):
    overview: OverviewMetrics
    waterfall: list[WaterfallItem]
    saturation_curves: list[SaturationChannel]
    efficiency_matrix: list[ChannelEfficiency]
    budget_optimization: BudgetOptimization
    insights: list[InsightCard]
    model_run_date: str
    data_period: str


# ── Chat ─────────────────────────────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str
    job_id: Optional[str] = None
    history: list[ChatMessage] = Field(default_factory=list)
