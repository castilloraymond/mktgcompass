import type { DashboardData } from "./types";

export const DEMO_DATA: DashboardData = {
  model_run_date: "April 2, 2026",
  data_period: "Jan 2024 — Dec 2025",

  overview: {
    total_revenue: 1_420_850,
    total_revenue_delta: 12.4,
    blended_roas: 3.85,
    blended_roas_vs_target: 0.35,
    weighted_cpa: 42.18,
    weighted_cpa_delta: -4.1,
    incrementality_lift: 18.4,
    incrementality_confidence: "high",
  },

  waterfall: [
    { label: "Baseline", value: 800_000, type: "baseline" },
    { label: "Paid Social", value: 240_000, type: "positive" },
    { label: "Paid Search", value: 155_000, type: "positive" },
    { label: "YouTube", value: 82_000, type: "positive" },
    { label: "Email", value: 61_500, type: "positive" },
    { label: "Display", value: 38_000, type: "positive" },
    { label: "Discounting", value: -45_000, type: "negative" },
    { label: "Seasonality", value: 89_350, type: "positive" },
    { label: "Total", value: 1_420_850, type: "total" },
  ],

  saturation_curves: [
    {
      channel: "Meta Ads",
      current_spend: 42_150,
      saturation_pct: 85,
      curve_points: [
        { spend: 0,      marginal_return: 0 },
        { spend: 5_000,  marginal_return: 5_200 },
        { spend: 10_000, marginal_return: 9_400 },
        { spend: 20_000, marginal_return: 15_600 },
        { spend: 30_000, marginal_return: 19_200 },
        { spend: 40_000, marginal_return: 21_100 },
        { spend: 42_150, marginal_return: 21_300 },
        { spend: 50_000, marginal_return: 22_400 },
        { spend: 60_000, marginal_return: 23_100 },
        { spend: 70_000, marginal_return: 23_500 },
        { spend: 80_000, marginal_return: 23_700 },
      ],
    },
    {
      channel: "Google Search",
      current_spend: 31_800,
      saturation_pct: 58,
      curve_points: [
        { spend: 0,      marginal_return: 0 },
        { spend: 5_000,  marginal_return: 6_800 },
        { spend: 10_000, marginal_return: 13_200 },
        { spend: 20_000, marginal_return: 24_100 },
        { spend: 31_800, marginal_return: 32_800 },
        { spend: 40_000, marginal_return: 38_200 },
        { spend: 50_000, marginal_return: 42_500 },
        { spend: 60_000, marginal_return: 45_300 },
        { spend: 70_000, marginal_return: 47_200 },
        { spend: 80_000, marginal_return: 48_500 },
      ],
    },
    {
      channel: "YouTube",
      current_spend: 18_200,
      saturation_pct: 41,
      curve_points: [
        { spend: 0,      marginal_return: 0 },
        { spend: 5_000,  marginal_return: 4_100 },
        { spend: 10_000, marginal_return: 8_500 },
        { spend: 18_200, marginal_return: 14_200 },
        { spend: 25_000, marginal_return: 18_400 },
        { spend: 35_000, marginal_return: 23_100 },
        { spend: 45_000, marginal_return: 26_800 },
        { spend: 55_000, marginal_return: 29_200 },
        { spend: 65_000, marginal_return: 30_900 },
        { spend: 80_000, marginal_return: 32_400 },
      ],
    },
    {
      channel: "Email",
      current_spend: 8_400,
      saturation_pct: 32,
      curve_points: [
        { spend: 0,      marginal_return: 0 },
        { spend: 2_000,  marginal_return: 3_800 },
        { spend: 4_000,  marginal_return: 7_200 },
        { spend: 8_400,  marginal_return: 13_800 },
        { spend: 12_000, marginal_return: 18_500 },
        { spend: 16_000, marginal_return: 22_200 },
        { spend: 20_000, marginal_return: 25_100 },
      ],
    },
  ],

  efficiency_matrix: [
    { channel: "Meta Ads",       channel_type: "Paid Social",  spend: 42_150, cpa: 32.10, roas: 5.69, grade: "A+", grade_label: "ELITE"   },
    { channel: "Email",          channel_type: "Owned Media",  spend:  8_400, cpa: 18.20, roas: 7.32, grade: "A+", grade_label: "ELITE"   },
    { channel: "Google Search",  channel_type: "Paid Search",  spend: 31_800, cpa: 38.50, roas: 4.87, grade: "A",  grade_label: "STRONG"  },
    { channel: "YouTube",        channel_type: "Video",        spend: 18_200, cpa: 44.10, roas: 4.01, grade: "B",  grade_label: "OPTIMAL" },
    { channel: "Display",        channel_type: "Programmatic", spend: 12_450, cpa: 61.30, roas: 3.05, grade: "C",  grade_label: "SCALING" },
    { channel: "TikTok",         channel_type: "Paid Social",  spend:  9_800, cpa: 74.20, roas: 2.44, grade: "C",  grade_label: "SCALING" },
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
    confidence_interval: "98.4% ± 0.2",
  },

  insights: [
    {
      id: "1",
      title: "Google Search has room to grow",
      body: "At 58% saturation, Google Search is your most efficient channel with room to scale. Shifting $20K from Meta could generate an additional $31K in revenue.",
      action: "Apply to Budget Lab",
      channel: "Google Search",
      impact: "+$31K projected",
      priority: "high",
    },
    {
      id: "2",
      title: "Meta Ads approaching saturation",
      body: "Meta is running at 85% saturation — you're paying premium prices for marginal returns. Consider reallocating $7-10K toward Search or YouTube.",
      action: "View Saturation Curve",
      channel: "Meta Ads",
      impact: "−$8K waste",
      priority: "high",
    },
    {
      id: "3",
      title: "Email is your highest-ROAS channel",
      body: "Email delivers 7.3x ROAS at only 32% saturation. Doubling your email investment could yield $28K in incremental revenue at very low cost.",
      action: "Scale Email Budget",
      channel: "Email",
      impact: "+$28K projected",
      priority: "medium",
    },
    {
      id: "4",
      title: "Seasonality accounts for 6.3% of revenue",
      body: "Your data shows strong Q4 seasonality. Planning a budget spike in October–November could amplify this organic lift by 2–3x.",
      action: "Learn More",
      impact: "Q4 planning tip",
      priority: "medium",
    },
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
