import type { DashboardData } from "./types";

/**
 * Demo data structured to match Meridian's actual outputs.
 *
 * - ROI = incremental ROI from mmm.get_roi(use_kpi=True)
 * - CPIK = cost per incremental KPI (not CPA)
 * - Hill curves = ec (half-saturation), slope parameters
 * - Waterfall = intercept + time effects + controls + channel contributions
 * - Credible intervals = Bayesian posterior CIs (not frequentist confidence)
 */
export const DEMO_DATA: DashboardData = {
  model_run_date: "April 2, 2026",
  data_period: "Jan 2024 — Dec 2025",

  overview: {
    total_revenue: 1_420_850,
    total_revenue_delta: 12.4,
    incremental_roi: 3.85,
    incremental_roi_ci: [3.22, 4.51],
    model_r_squared: 0.94,
    incremental_revenue: 576_500,
    incremental_revenue_ci: [498_200, 651_800],
  },

  waterfall: [
    { label: "Intercept",      value: 620_000, type: "intercept" },
    { label: "Time Effects",   value: 135_000, type: "time_effects" },
    { label: "Controls",       value:  89_350, type: "controls" },
    { label: "Paid Social",    value: 240_000, type: "channel" },
    { label: "Paid Search",    value: 155_000, type: "channel" },
    { label: "YouTube",        value:  82_000, type: "channel" },
    { label: "Email",          value:  61_500, type: "channel" },
    { label: "Display",        value:  38_000, type: "channel" },
    { label: "Total",          value: 1_420_850, type: "total" },
  ],

  hill_curves: [
    {
      channel: "Meta Ads",
      ec: 32_400,
      ec_ci: [28_100, 37_200],
      slope: 1.82,
      slope_ci: [1.45, 2.21],
      current_spend: 42_150,
      curve_points: [
        { spend: 0,      response: 0,      response_ci_lower: 0,      response_ci_upper: 0 },
        { spend: 5_000,  response: 5_200,  response_ci_lower: 4_100,  response_ci_upper: 6_400 },
        { spend: 10_000, response: 9_400,  response_ci_lower: 7_600,  response_ci_upper: 11_300 },
        { spend: 20_000, response: 15_600, response_ci_lower: 12_800, response_ci_upper: 18_500 },
        { spend: 30_000, response: 19_200, response_ci_lower: 16_100, response_ci_upper: 22_400 },
        { spend: 40_000, response: 21_100, response_ci_lower: 17_900, response_ci_upper: 24_400 },
        { spend: 42_150, response: 21_300, response_ci_lower: 18_100, response_ci_upper: 24_600 },
        { spend: 50_000, response: 22_400, response_ci_lower: 19_200, response_ci_upper: 25_700 },
        { spend: 60_000, response: 23_100, response_ci_lower: 19_900, response_ci_upper: 26_400 },
        { spend: 70_000, response: 23_500, response_ci_lower: 20_300, response_ci_upper: 26_800 },
        { spend: 80_000, response: 23_700, response_ci_lower: 20_500, response_ci_upper: 27_000 },
      ],
    },
    {
      channel: "Google Search",
      ec: 48_200,
      ec_ci: [41_500, 55_800],
      slope: 1.45,
      slope_ci: [1.12, 1.80],
      current_spend: 31_800,
      curve_points: [
        { spend: 0,      response: 0,      response_ci_lower: 0,      response_ci_upper: 0 },
        { spend: 5_000,  response: 6_800,  response_ci_lower: 5_200,  response_ci_upper: 8_500 },
        { spend: 10_000, response: 13_200, response_ci_lower: 10_400, response_ci_upper: 16_100 },
        { spend: 20_000, response: 24_100, response_ci_lower: 19_600, response_ci_upper: 28_800 },
        { spend: 31_800, response: 32_800, response_ci_lower: 27_200, response_ci_upper: 38_600 },
        { spend: 40_000, response: 38_200, response_ci_lower: 32_100, response_ci_upper: 44_500 },
        { spend: 50_000, response: 42_500, response_ci_lower: 36_200, response_ci_upper: 49_100 },
        { spend: 60_000, response: 45_300, response_ci_lower: 38_800, response_ci_upper: 52_100 },
        { spend: 70_000, response: 47_200, response_ci_lower: 40_600, response_ci_upper: 54_100 },
        { spend: 80_000, response: 48_500, response_ci_lower: 41_800, response_ci_upper: 55_500 },
      ],
    },
    {
      channel: "YouTube",
      ec: 38_500,
      ec_ci: [31_200, 46_800],
      slope: 1.28,
      slope_ci: [0.95, 1.64],
      current_spend: 18_200,
      curve_points: [
        { spend: 0,      response: 0,      response_ci_lower: 0,      response_ci_upper: 0 },
        { spend: 5_000,  response: 4_100,  response_ci_lower: 2_800,  response_ci_upper: 5_600 },
        { spend: 10_000, response: 8_500,  response_ci_lower: 6_200,  response_ci_upper: 11_100 },
        { spend: 18_200, response: 14_200, response_ci_lower: 10_600, response_ci_upper: 18_100 },
        { spend: 25_000, response: 18_400, response_ci_lower: 14_100, response_ci_upper: 23_000 },
        { spend: 35_000, response: 23_100, response_ci_lower: 18_000, response_ci_upper: 28_500 },
        { spend: 45_000, response: 26_800, response_ci_lower: 21_200, response_ci_upper: 32_700 },
        { spend: 55_000, response: 29_200, response_ci_lower: 23_300, response_ci_upper: 35_400 },
        { spend: 65_000, response: 30_900, response_ci_lower: 24_800, response_ci_upper: 37_300 },
        { spend: 80_000, response: 32_400, response_ci_lower: 26_100, response_ci_upper: 39_000 },
      ],
    },
    {
      channel: "Email",
      ec: 22_100,
      ec_ci: [17_800, 27_400],
      slope: 1.15,
      slope_ci: [0.82, 1.51],
      current_spend: 8_400,
      curve_points: [
        { spend: 0,      response: 0,      response_ci_lower: 0,      response_ci_upper: 0 },
        { spend: 2_000,  response: 3_800,  response_ci_lower: 2_400,  response_ci_upper: 5_300 },
        { spend: 4_000,  response: 7_200,  response_ci_lower: 4_800,  response_ci_upper: 9_800 },
        { spend: 8_400,  response: 13_800, response_ci_lower: 9_600,  response_ci_upper: 18_200 },
        { spend: 12_000, response: 18_500, response_ci_lower: 13_200, response_ci_upper: 24_100 },
        { spend: 16_000, response: 22_200, response_ci_lower: 16_100, response_ci_upper: 28_600 },
        { spend: 20_000, response: 25_100, response_ci_lower: 18_400, response_ci_upper: 32_100 },
      ],
    },
  ],

  efficiency_matrix: [
    { channel: "Meta Ads",       channel_type: "Paid Social",  spend: 42_150, roi: 5.69, roi_ci: [4.82, 6.61], cpik: 32.10, incremental_outcome: 240_000, grade: "A+", grade_label: "ELITE" },
    { channel: "Email",          channel_type: "Owned Media",  spend:  8_400, roi: 7.32, roi_ci: [5.84, 8.91], cpik: 18.20, incremental_outcome: 61_500,  grade: "A+", grade_label: "ELITE" },
    { channel: "Google Search",  channel_type: "Paid Search",  spend: 31_800, roi: 4.87, roi_ci: [3.95, 5.82], cpik: 38.50, incremental_outcome: 155_000, grade: "A",  grade_label: "STRONG" },
    { channel: "YouTube",        channel_type: "Video",        spend: 18_200, roi: 4.01, roi_ci: [2.89, 5.18], cpik: 44.10, incremental_outcome: 82_000,  grade: "B",  grade_label: "OPTIMAL" },
    { channel: "Display",        channel_type: "Programmatic", spend: 12_450, roi: 3.05, roi_ci: [2.11, 4.02], cpik: 61.30, incremental_outcome: 38_000,  grade: "B",  grade_label: "OPTIMAL" },
    { channel: "TikTok",         channel_type: "Paid Social",  spend:  9_800, roi: 2.44, roi_ci: [1.52, 3.41], cpik: 74.20, incremental_outcome: 23_900,  grade: "C",  grade_label: "SCALING" },
  ],

  budget_optimization: {
    total_budget: 150_000,
    current_allocation: [
      { channel: "Meta Ads",      amount: 42_150 },
      { channel: "Google Search", amount: 31_800 },
      { channel: "YouTube",       amount: 18_200 },
      { channel: "Email",         amount:  8_400 },
      { channel: "Display",       amount: 12_450 },
      { channel: "TikTok",        amount:  9_800 },
    ],
    recommended_allocation: [
      { channel: "Meta Ads",      amount: 35_000, delta: -7_150 },
      { channel: "Google Search", amount: 52_000, delta: 20_200 },
      { channel: "YouTube",       amount: 32_000, delta: 13_800 },
      { channel: "Email",         amount: 16_000, delta:  7_600 },
      { channel: "Display",       amount:  8_000, delta: -4_450 },
      { channel: "TikTok",        amount:  7_000, delta: -2_800 },
    ],
    projected_lift_pct: 14.2,
    credible_interval: "90% CI: [11.8%, 16.9%]",
  },

  insights: [
    {
      id: "1",
      title: "Google Search has headroom on the Hill curve",
      body: "With ec at $48K and current spend at $32K, Google Search is operating well below its half-saturation point. The model estimates shifting $20K from Meta could generate an additional $31K in incremental revenue.",
      action: "Apply to Budget Lab",
      channel: "Google Search",
      impact: "+$31K incremental",
      priority: "high",
    },
    {
      id: "2",
      title: "Meta Ads past the half-saturation point",
      body: "Meta's current spend ($42K) exceeds its ec ($32K), meaning you're on the steep part of diminishing returns. Consider reallocating $7-10K toward channels with lower saturation.",
      action: "View Hill Curve",
      channel: "Meta Ads",
      impact: "Diminishing mROI",
      priority: "high",
    },
    {
      id: "3",
      title: "Email has the highest incremental ROI",
      body: "Email delivers 7.3x incremental ROI (90% CI: [5.8x, 8.9x]) and sits well below its ec. Doubling your email investment could yield $28K in incremental revenue at very low marginal cost.",
      action: "Scale Email Budget",
      channel: "Email",
      impact: "+$28K incremental",
      priority: "medium",
    },
    {
      id: "4",
      title: "Time effects capture seasonal patterns",
      body: "The model's time-varying intercept shows strong Q4 seasonality worth $135K. Planning a budget spike in October–November could amplify this organic lift.",
      action: "Learn More",
      impact: "Q4 planning tip",
      priority: "medium",
    },
  ],

  model_health: {
    fit_chart: [
      { period: "2024-01", actual: 165_200, expected: 162_800, ci_lower: 148_500, ci_upper: 177_100 },
      { period: "2024-02", actual: 158_400, expected: 160_200, ci_lower: 146_100, ci_upper: 174_300 },
      { period: "2024-03", actual: 172_100, expected: 169_500, ci_lower: 155_200, ci_upper: 183_800 },
      { period: "2024-04", actual: 168_900, expected: 171_400, ci_lower: 157_100, ci_upper: 185_700 },
      { period: "2024-05", actual: 175_300, expected: 173_800, ci_lower: 159_500, ci_upper: 188_100 },
      { period: "2024-06", actual: 180_200, expected: 178_600, ci_lower: 164_300, ci_upper: 192_900 },
      { period: "2024-07", actual: 176_800, expected: 179_100, ci_lower: 164_800, ci_upper: 193_400 },
      { period: "2024-08", actual: 182_500, expected: 180_200, ci_lower: 165_900, ci_upper: 194_500 },
      { period: "2024-09", actual: 188_100, expected: 185_400, ci_lower: 171_100, ci_upper: 199_700 },
      { period: "2024-10", actual: 198_500, expected: 195_800, ci_lower: 181_500, ci_upper: 210_100 },
      { period: "2024-11", actual: 210_200, expected: 207_400, ci_lower: 193_100, ci_upper: 221_700 },
      { period: "2024-12", actual: 224_800, expected: 221_600, ci_lower: 207_300, ci_upper: 235_900 },
    ],
    fit_metrics: {
      r_squared: 0.94,
      mape: 2.1,
      wmape: 1.8,
    },
    convergence: [
      { parameter: "Media Coefficients",  rhat: 1.003, status: "converged" },
      { parameter: "Adstock Alpha",       rhat: 1.008, status: "converged" },
      { parameter: "Hill EC",             rhat: 1.012, status: "converged" },
      { parameter: "Hill Slope",          rhat: 1.005, status: "converged" },
      { parameter: "Control Coefficients", rhat: 1.002, status: "converged" },
      { parameter: "Time Effects (Knots)", rhat: 1.018, status: "converged" },
      { parameter: "Sigma (Noise)",        rhat: 1.001, status: "converged" },
    ],
    convergence_status: "converged",
  },

  adstock_decay: [
    {
      channel: "Meta Ads",
      decay_weights: [
        { lag: 0, weight: 1.00, ci_lower: 1.00, ci_upper: 1.00 },
        { lag: 1, weight: 0.62, ci_lower: 0.48, ci_upper: 0.74 },
        { lag: 2, weight: 0.38, ci_lower: 0.23, ci_upper: 0.55 },
        { lag: 3, weight: 0.24, ci_lower: 0.11, ci_upper: 0.41 },
        { lag: 4, weight: 0.15, ci_lower: 0.05, ci_upper: 0.30 },
        { lag: 5, weight: 0.09, ci_lower: 0.02, ci_upper: 0.22 },
        { lag: 6, weight: 0.06, ci_lower: 0.01, ci_upper: 0.16 },
        { lag: 7, weight: 0.03, ci_lower: 0.00, ci_upper: 0.12 },
      ],
    },
    {
      channel: "Google Search",
      decay_weights: [
        { lag: 0, weight: 1.00, ci_lower: 1.00, ci_upper: 1.00 },
        { lag: 1, weight: 0.35, ci_lower: 0.22, ci_upper: 0.49 },
        { lag: 2, weight: 0.12, ci_lower: 0.05, ci_upper: 0.24 },
        { lag: 3, weight: 0.04, ci_lower: 0.01, ci_upper: 0.12 },
        { lag: 4, weight: 0.02, ci_lower: 0.00, ci_upper: 0.06 },
        { lag: 5, weight: 0.01, ci_lower: 0.00, ci_upper: 0.03 },
        { lag: 6, weight: 0.00, ci_lower: 0.00, ci_upper: 0.01 },
        { lag: 7, weight: 0.00, ci_lower: 0.00, ci_upper: 0.01 },
      ],
    },
    {
      channel: "YouTube",
      decay_weights: [
        { lag: 0, weight: 1.00, ci_lower: 1.00, ci_upper: 1.00 },
        { lag: 1, weight: 0.78, ci_lower: 0.65, ci_upper: 0.88 },
        { lag: 2, weight: 0.61, ci_lower: 0.42, ci_upper: 0.77 },
        { lag: 3, weight: 0.47, ci_lower: 0.27, ci_upper: 0.68 },
        { lag: 4, weight: 0.37, ci_lower: 0.18, ci_upper: 0.59 },
        { lag: 5, weight: 0.29, ci_lower: 0.12, ci_upper: 0.52 },
        { lag: 6, weight: 0.22, ci_lower: 0.07, ci_upper: 0.46 },
        { lag: 7, weight: 0.17, ci_lower: 0.05, ci_upper: 0.40 },
      ],
    },
    {
      channel: "Email",
      decay_weights: [
        { lag: 0, weight: 1.00, ci_lower: 1.00, ci_upper: 1.00 },
        { lag: 1, weight: 0.45, ci_lower: 0.30, ci_upper: 0.60 },
        { lag: 2, weight: 0.20, ci_lower: 0.09, ci_upper: 0.36 },
        { lag: 3, weight: 0.09, ci_lower: 0.03, ci_upper: 0.22 },
        { lag: 4, weight: 0.04, ci_lower: 0.01, ci_upper: 0.13 },
        { lag: 5, weight: 0.02, ci_lower: 0.00, ci_upper: 0.08 },
        { lag: 6, weight: 0.01, ci_lower: 0.00, ci_upper: 0.05 },
        { lag: 7, weight: 0.00, ci_lower: 0.00, ci_upper: 0.03 },
      ],
    },
  ],

  contributions_over_time: [
    { period: "2024-Q1", baseline: 82_000, "Paid Social": 19_200, "Paid Search": 12_400, "YouTube": 6_400, "Email": 4_800, "Display": 3_100 },
    { period: "2024-Q2", baseline: 84_500, "Paid Social": 20_100, "Paid Search": 13_100, "YouTube": 6_900, "Email": 5_100, "Display": 3_200 },
    { period: "2024-Q3", baseline: 86_200, "Paid Social": 20_800, "Paid Search": 13_500, "YouTube": 7_100, "Email": 5_300, "Display": 3_300 },
    { period: "2024-Q4", baseline: 98_400, "Paid Social": 22_400, "Paid Search": 14_200, "YouTube": 7_800, "Email": 5_800, "Display": 3_400 },
  ],
};

export const CHART_COLORS = {
  primary:   "#2563EB",   // accent blue — primary series, Organic
  secondary: "#F59E0B",   // amber — reserved for Paid Search
  tertiary:  "#10B981",   // green — growth
  info:      "#06B6D4",   // cyan — Brand
  baseline:  "#9CA3AF",
  muted:     "#E5E7EB",
  channels: [
    "#2563EB", "#F59E0B", "#10B981", "#06B6D4",
    "#7C3AED", "#DB2777", "#0891B2", "#65A30D",
  ],
} as const;
