"""Pydantic v2 schemas for all API request/response models (Meridian-aligned)."""

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


# ── Dashboard Data (Meridian-aligned) ────────────────────────────────────────

class OverviewMetrics(BaseModel):
    total_revenue: float
    total_revenue_delta: float
    incremental_roi: float
    incremental_roi_ci: tuple[float, float]   # 90% credible interval
    model_r_squared: float
    incremental_revenue: float
    incremental_revenue_ci: tuple[float, float]


class WaterfallItem(BaseModel):
    label: str
    value: float
    type: Literal["intercept", "time_effects", "controls", "channel", "total"]


class HillCurvePoint(BaseModel):
    spend: float
    response: float
    response_ci_lower: float
    response_ci_upper: float


class HillCurveChannel(BaseModel):
    channel: str
    ec: float                           # half-saturation point
    ec_ci: tuple[float, float]
    slope: float
    slope_ci: tuple[float, float]
    current_spend: float
    curve_points: list[HillCurvePoint]


class ChannelEfficiency(BaseModel):
    channel: str
    channel_type: str
    spend: float
    roi: float                          # incremental ROI (posterior mean)
    roi_ci: tuple[float, float]         # 90% credible interval
    cpik: float                         # cost per incremental KPI
    incremental_outcome: float
    grade: Literal["A+", "A", "B", "C", "D"]
    grade_label: Literal["ELITE", "STRONG", "OPTIMAL", "SCALING", "UNDERPERFORMING"]


class BudgetAllocation(BaseModel):
    channel: str
    amount: float
    delta: Optional[float] = None


class BudgetOptimization(BaseModel):
    total_budget: float
    current_allocation: list[BudgetAllocation]
    recommended_allocation: list[BudgetAllocation]
    projected_lift_pct: float
    credible_interval: str


class InsightCard(BaseModel):
    id: str
    title: str
    body: str
    action: Optional[str] = None
    channel: Optional[str] = None
    impact: Optional[str] = None
    priority: Literal["high", "medium", "low"]


# ── Model Health ─────────────────────────────────────────────────────────────

class ModelFitPoint(BaseModel):
    period: str
    actual: float
    expected: float
    ci_lower: float
    ci_upper: float


class ModelFitMetrics(BaseModel):
    r_squared: float
    mape: float
    wmape: float


class ConvergenceParam(BaseModel):
    parameter: str
    rhat: float
    status: Literal["converged", "borderline", "not_converged"]


class AdstockDecayWeight(BaseModel):
    lag: int
    weight: float
    ci_lower: float
    ci_upper: float


class AdstockDecayChannel(BaseModel):
    channel: str
    decay_weights: list[AdstockDecayWeight]


class ContributionTimePoint(BaseModel):
    period: str
    baseline: float
    # Channel contributions are dynamic keys — stored as extra dict fields


class ModelHealth(BaseModel):
    fit_chart: list[ModelFitPoint]
    fit_metrics: ModelFitMetrics
    convergence: list[ConvergenceParam]
    convergence_status: Literal["converged", "borderline", "not_converged"]


class DashboardResults(BaseModel):
    overview: OverviewMetrics
    waterfall: list[WaterfallItem]
    hill_curves: list[HillCurveChannel]
    efficiency_matrix: list[ChannelEfficiency]
    budget_optimization: BudgetOptimization
    insights: list[InsightCard]
    model_health: ModelHealth
    adstock_decay: list[AdstockDecayChannel]
    contributions_over_time: list[dict]  # ContributionTimePoint-like dicts
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
