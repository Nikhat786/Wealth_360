import { clamp } from "./format";

export type PillarKey =
  | "savings"
  | "protection"
  | "diversification"
  | "debt"
  | "liquidity"
  | "goals";

export interface ScoreInputs {
  /** Take-home monthly income, ₹ */
  monthlyIncome: number;
  /** Total monthly expenses, ₹ */
  monthlyExpenses: number;
  /** Monthly investments / SIPs, ₹ */
  monthlyInvestment: number;
  /** Months of expenses held as emergency cash */
  emergencyMonths: number;
  /** Life cover as a multiple of annual income */
  lifeCoverMultiple: number;
  /** Health cover, ₹ */
  healthCover: number;
  /** Total monthly EMIs, ₹ */
  monthlyEmi: number;
  /** Number of distinct asset classes held */
  assetClasses: number;
  /** Share of portfolio in the single largest asset class, % */
  largestAssetSharePct: number;
  /** Average funded progress across goals, % */
  goalFundedPct: number;
  /** Share of goals that are on track, % */
  goalsOnTrackPct: number;
}

export interface Pillar {
  key: PillarKey;
  label: string;
  short: string;
  score: number;
  weight: number;
  summary: string;
  tip: string;
}

export interface ScoreResult {
  total: number;
  grade: string;
  gradeLabel: string;
  pillars: Pillar[];
}

const WEIGHTS: Record<PillarKey, number> = {
  savings: 0.22,
  protection: 0.18,
  diversification: 0.16,
  debt: 0.16,
  liquidity: 0.14,
  goals: 0.14,
};

export function savingsRate(i: ScoreInputs): number {
  if (i.monthlyIncome <= 0) return 0;
  return ((i.monthlyIncome - i.monthlyExpenses) / i.monthlyIncome) * 100;
}

export function investmentRate(i: ScoreInputs): number {
  if (i.monthlyIncome <= 0) return 0;
  return (i.monthlyInvestment / i.monthlyIncome) * 100;
}

export function emiRatio(i: ScoreInputs): number {
  if (i.monthlyIncome <= 0) return 0;
  return (i.monthlyEmi / i.monthlyIncome) * 100;
}

export function computeScore(i: ScoreInputs): ScoreResult {
  const rate = savingsRate(i);
  const invest = investmentRate(i);
  const savings = clamp(rate * 2 * 0.6 + invest * 3 * 0.4);

  const lifeScore = clamp((i.lifeCoverMultiple / 12) * 100);
  const healthScore = clamp((i.healthCover / 1_000_000) * 100);
  const protection = clamp(lifeScore * 0.6 + healthScore * 0.4);

  const breadth = clamp((i.assetClasses / 6) * 100);
  const concentration = clamp(100 - Math.max(0, i.largestAssetSharePct - 35) * 2.2);
  const diversification = clamp(breadth * 0.45 + concentration * 0.55);

  const emi = emiRatio(i);
  const debt = clamp(100 - Math.max(0, emi - 10) * 3.2);

  const liquidity = clamp((i.emergencyMonths / 6) * 100);

  const goals = clamp(i.goalFundedPct * 0.55 + i.goalsOnTrackPct * 0.45);

  const raw: Record<PillarKey, number> = {
    savings,
    protection,
    diversification,
    debt,
    liquidity,
    goals,
  };

  const pillars: Pillar[] = [
    {
      key: "savings",
      label: "Savings & investing",
      short: "Savings",
      score: Math.round(savings),
      weight: WEIGHTS.savings,
      summary: `You save ${rate.toFixed(0)}% of income and invest ${invest.toFixed(0)}% of it every month.`,
      tip: "Push your monthly SIP up by ₹10,000 to move this pillar into the 80s.",
    },
    {
      key: "protection",
      label: "Insurance protection",
      short: "Protection",
      score: Math.round(protection),
      weight: WEIGHTS.protection,
      summary: `Life cover is ${i.lifeCoverMultiple.toFixed(1)}x annual income; health cover is ₹${(i.healthCover / 100000).toFixed(0)}L.`,
      tip: "Aim for 10-12x annual income in term cover and a ₹10L family floater.",
    },
    {
      key: "diversification",
      label: "Diversification",
      short: "Diversify",
      score: Math.round(diversification),
      weight: WEIGHTS.diversification,
      summary: `${i.assetClasses} asset classes held, with ${i.largestAssetSharePct.toFixed(0)}% in the largest one.`,
      tip: "Trim your single largest holding below 35% of the portfolio.",
    },
    {
      key: "debt",
      label: "Debt health",
      short: "Debt",
      score: Math.round(debt),
      weight: WEIGHTS.debt,
      summary: `EMIs take up ${emi.toFixed(0)}% of monthly income.`,
      tip: "Keeping total EMIs under 30% of income protects this score.",
    },
    {
      key: "liquidity",
      label: "Emergency buffer",
      short: "Liquidity",
      score: Math.round(liquidity),
      weight: WEIGHTS.liquidity,
      summary: `${i.emergencyMonths.toFixed(1)} months of expenses sit in liquid savings.`,
      tip: "Six months of expenses in a liquid fund is the target.",
    },
    {
      key: "goals",
      label: "Goal readiness",
      short: "Goals",
      score: Math.round(goals),
      weight: WEIGHTS.goals,
      summary: `Goals are ${i.goalFundedPct.toFixed(0)}% funded and ${i.goalsOnTrackPct.toFixed(0)}% are on track.`,
      tip: "Re-align the two goals that are behind schedule to lift this pillar.",
    },
  ];

  const total = Math.round(
    pillars.reduce((sum, p) => sum + raw[p.key] * p.weight, 0),
  );

  return { total, ...gradeFor(total), pillars };
}

export function gradeFor(total: number): { grade: string; gradeLabel: string } {
  if (total >= 85) return { grade: "A+", gradeLabel: "Excellent" };
  if (total >= 75) return { grade: "A", gradeLabel: "Strong" };
  if (total >= 65) return { grade: "B+", gradeLabel: "Healthy" };
  if (total >= 55) return { grade: "B", gradeLabel: "Building" };
  if (total >= 45) return { grade: "C", gradeLabel: "Needs work" };
  return { grade: "D", gradeLabel: "At risk" };
}

export function scoreTone(score: number): "success" | "gold" | "destructive" {
  if (score >= 70) return "success";
  if (score >= 45) return "gold";
  return "destructive";
}
