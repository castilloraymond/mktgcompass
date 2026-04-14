// ── Dashboard Data Types (Meridian-aligned) ─────────────────────────

export interface OverviewMetrics {
  total_revenue: number;
  total_revenue_delta: number;
  incremental_roi: number;
  incremental_roi_ci: [number, number]; // 90% credible interval
  model_r_squared: number;
  incremental_revenue: number;
  incremental_revenue_ci: [number, number];
}

export interface WaterfallItem {
  label: string;
  value: number;
  type: "intercept" | "time_effects" | "controls" | "channel" | "total";
}

/** Hill curve parameters from Meridian posterior */
export interface HillCurveChannel {
  channel: string;
  ec: number;           // half-saturation point (posterior mean)
  ec_ci: [number, number];
  slope: number;        // Hill slope (posterior mean)
  slope_ci: [number, number];
  current_spend: number;
  curve_points: HillCurvePoint[];
}

export interface HillCurvePoint {
  spend: number;
  response: number;        // incremental outcome (posterior mean)
  response_ci_lower: number;
  response_ci_upper: number;
}

export type EfficiencyGrade = "A+" | "A" | "B" | "C" | "D";
export type GradeLabel = "ELITE" | "STRONG" | "OPTIMAL" | "SCALING" | "UNDERPERFORMING";

export interface ChannelEfficiency {
  channel: string;
  channel_type: string;
  spend: number;
  roi: number;                 // incremental ROI (posterior mean)
  roi_ci: [number, number];   // 90% credible interval
  cpik: number;                // cost per incremental KPI
  incremental_outcome: number;
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
  credible_interval: string;   // "90% CI: [X, Y]"
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

/** Model fit data for Model Health page */
export interface ModelFitPoint {
  period: string;
  actual: number;
  expected: number;
  ci_lower: number;
  ci_upper: number;
}

export interface ModelFitMetrics {
  r_squared: number;
  mape: number;
  wmape: number;
}

export interface ConvergenceParam {
  parameter: string;
  rhat: number;
  status: "converged" | "borderline" | "not_converged";
}

export interface AdstockDecayChannel {
  channel: string;
  decay_weights: { lag: number; weight: number; ci_lower: number; ci_upper: number }[];
}

export interface ContributionTimePoint {
  period: string;
  baseline: number;
  [channel: string]: number | string; // channel contributions + period string
}

export interface ModelHealth {
  fit_chart: ModelFitPoint[];
  fit_metrics: ModelFitMetrics;
  convergence: ConvergenceParam[];
  convergence_status: "converged" | "borderline" | "not_converged";
}

export interface DashboardData {
  overview: OverviewMetrics;
  waterfall: WaterfallItem[];
  hill_curves: HillCurveChannel[];
  efficiency_matrix: ChannelEfficiency[];
  budget_optimization: BudgetOptimization;
  insights: InsightCard[];
  model_health: ModelHealth;
  adstock_decay: AdstockDecayChannel[];
  contributions_over_time: ContributionTimePoint[];
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

// ── Column Mapping Types ─────────────────────────────────────────────

export interface ColumnMapping {
  time_col: string;
  kpi_col: string;
  kpi_type: "revenue" | "non_revenue";
  spend_cols: string[];
  media_cols: string[];   // impression columns (optional)
  control_cols: string[];
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
