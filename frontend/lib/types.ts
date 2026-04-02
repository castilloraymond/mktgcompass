// ── Dashboard Data Types ──────────────────────────────────────────────

export interface OverviewMetrics {
  total_revenue: number;
  total_revenue_delta: number;
  blended_roas: number;
  blended_roas_vs_target: number;
  weighted_cpa: number;
  weighted_cpa_delta: number;
  incrementality_lift: number;
  incrementality_confidence: "high" | "medium" | "low";
}

export interface WaterfallItem {
  label: string;
  value: number;
  type: "baseline" | "positive" | "negative" | "total";
}

export interface SaturationCurvePoint {
  spend: number;
  marginal_return: number;
}

export interface SaturationChannel {
  channel: string;
  current_spend: number;
  saturation_pct: number;
  curve_points: SaturationCurvePoint[];
}

export type EfficiencyGrade = "A+" | "A" | "B" | "C" | "D";
export type GradeLabel = "ELITE" | "STRONG" | "OPTIMAL" | "SCALING" | "POOR";

export interface ChannelEfficiency {
  channel: string;
  channel_type: string;
  spend: number;
  cpa: number;
  roas: number;
  grade: EfficiencyGrade;
  grade_label: GradeLabel;
}

export interface BudgetAllocation {
  channel: string;
  amount: number;
  delta?: number;
}

export interface BudgetOptimization {
  total_budget: number;
  current_allocation: BudgetAllocation[];
  recommended_allocation: BudgetAllocation[];
  projected_lift_pct: number;
  confidence_interval: string;
}

export interface InsightCard {
  id: string;
  title: string;
  body: string;
  action?: string;
  channel?: string;
  impact?: string;
  priority: "high" | "medium" | "low";
}

export interface DashboardData {
  overview: OverviewMetrics;
  waterfall: WaterfallItem[];
  saturation_curves: SaturationChannel[];
  efficiency_matrix: ChannelEfficiency[];
  budget_optimization: BudgetOptimization;
  insights: InsightCard[];
  model_run_date: string;
  data_period: string;
}

// ── Validation Types ──────────────────────────────────────────────────

export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  category: "schema" | "completeness" | "quality" | "readiness";
  what: string;
  why: string;
  fix: string;
  column?: string;
}

export interface DataSummary {
  row_count: number;
  column_count: number;
  date_range: string;
  channels_detected: string[];
  kpi_column: string;
  total_spend: number;
  total_kpi: number;
}

export interface ValidationResult {
  status: "pass" | "warnings" | "errors";
  can_proceed: boolean;
  issues: ValidationIssue[];
  data_summary: DataSummary;
}

// ── Chat Types ────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ── Job Types ─────────────────────────────────────────────────────────

export type JobStatus = "pending" | "validating" | "training" | "interpreting" | "complete" | "error";

export interface TrainingJob {
  job_id: string;
  status: JobStatus;
  progress_pct: number;
  message: string;
  created_at: string;
  completed_at?: string;
}
