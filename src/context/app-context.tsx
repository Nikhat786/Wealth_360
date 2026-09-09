import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { coachReply, type CoachContext } from "@/lib/coach";
import {
  buildActions,
  defaultDocs,
  defaultNominations,
  nextBestAction,
  nominationSummary,
  noExtraCover,
  protectionScore,
  totalHealthCover,
  totalLifeCover,
  transferScore,
  type CoverState,
  type DerivedAction,
  type NominationMap,
  type NomineeEntry,
} from "@/lib/derived";
import { projectGoal } from "@/lib/goal-math";
import {
  baseScoreInputs,
  goals as baseGoals,
  idleCash,
  largestAssetSharePct,
  liabilities,
  taxSaving,
  type Goal,
} from "@/lib/mock-data";
import { computeScore, type ScoreInputs, type ScoreResult } from "@/lib/score";
import {
  emptySim,
  financialDNA,
  readinessScore,
  simulate,
  type RiskProfile,
  type SimulatorResult,
  type SimulatorState,
} from "@/lib/wealth360";

export interface FamilyMember {
  id: string;
  name: string;
  relation: "Spouse" | "Child" | "Parent" | "Other";
  age: number;
  dependency: "Full" | "Partial" | "None";
  needs: string;
  educationGoal?: string;
  educationYear?: number;
  educationCorpus?: number;
}

export interface AssetRecord {
  id: string;
  name: string;
  type: string;
  investedValue: number;
  currentValue: number;
  startDate: string;
  holdingPeriod: number;
  actualReturn: number;
  expectedReturn: number;
  risk: "Low" | "Moderate" | "High";
  liquidity: "High" | "Medium" | "Low";
  taxTreatment: string;
  incomeGenerated: number;
  linkedGoal: string;
  ownership: string;
  details: Record<string, string | number>;
}

export interface LiabilityRecord {
  id: string;
  provider: string;
  type: string;
  originalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  emi: number;
  startDate: string;
  originalTenure: number;
  remainingTenure: number;
  endDate: string;
  rateType: "Fixed" | "Floating";
  prepaymentOption: boolean;
  prepaymentPenalty: number;
}

export interface GoalRecord {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  targetYear: number;
  duration: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflation: number;
  priority: "High" | "Medium" | "Low";
  linkedInvestments: string[];
  fundingSource: string;
}

export interface InsurancePolicy {
  id: string;
  insurer: string;
  type: "Life" | "Health" | "Personal Accident";
  sumAssured: number;
  premium: number;
  term: number;
  startDate: string;
  renewalDate: string;
  nominee: string;
  coveredMembers: string[];
}

export interface LifeEventRecord {
  id: string;
  event: string;
  year: number;
  estimatedCost: number;
  importance: "High" | "Medium" | "Low";
}

export interface OnboardingAnswers {
  // Step 2 — about you
  name: string;
  age: number;
  gender: "Female" | "Male" | "Non-binary" | "Prefer not to say" | "";
  city: string;
  maritalStatus: "Single" | "Married";
  occupation: string;
  employer: string;
  annualIncome: number;
  dependents: number;
  familyMembers: FamilyMember[];
  familyPriorities: string[];
  // Step 3 — income
  salary: number;
  businessIncome: number;
  annualBonus: number;
  rentalIncome: number;
  dividendsIncome: number;
  interestIncome: number;
  otherIncome: number;
  // Step 4 — expenses
  household: number;
  schoolFees: number;
  emiExpenses: number;
  insuranceExpenses: number;
  lifestyle: number;
  healthcareExpenses: number;
  travelExpenses: number;
  otherExpenses: number;
  // Step 5 — assets
  equity: number;
  mutualFunds: number;
  deposits: number;
  gold: number;
  retirementCorpus: number;
  cashSavings: number;
  propertyValue: number;
  // Step 6 — loans
  homeLoanEmi: number;
  carLoanEmi: number;
  personalLoanEmi: number;
  creditCardDues: number;
  // Step 7 — insurance
  lifeCover: number;
  healthCover: number;
  criticalIllnessCover: number;
  // Step 8 — goals
  selectedGoals: string[];
  monthlyInvestment: number;
  goalDetails: Record<string, { target: number; targetYear: number; monthly: number; priority: "High" | "Medium" | "Low" }>;
  // Step 9 — nominations & documents
  nomineesOnRecord: "all" | "some" | "none";
  hasWill: boolean;
  // Step 10 — risk
  riskAppetite: number;
  horizon: number;
  reactionToDrop: "sell" | "hold" | "buy";
  liquidityPreference: "High" | "Medium" | "Low";
  preferredAssetClasses: string[];
  lifeEvents: string[];
  monthlyTakeHome: number;
  expectedIncomeGrowth: number;
  retirementAge: number;
  assets: AssetRecord[];
  liabilities: LiabilityRecord[];
  insurancePolicies: InsurancePolicy[];
  goals: GoalRecord[];
  futureEvents: LifeEventRecord[];
}

export const defaultAnswers: OnboardingAnswers = {
  name: "Rahul Mehta",
  age: 36,
  gender: "Male",
  city: "Mumbai",
  maritalStatus: "Married",
  occupation: "Technology Professional",
  employer: "Technology company",
  annualIncome: 3000000,
  monthlyTakeHome: 250000,
  expectedIncomeGrowth: 8,
  retirementAge: 58,
  dependents: 3,
  familyMembers: [
    { id: "family-spouse", name: "Priya Mehta", relation: "Spouse", age: 34, dependency: "Partial", needs: "Family security" },
    { id: "family-child-1", name: "Aanya Mehta", relation: "Child", age: 7, dependency: "Full", needs: "Education", educationGoal: "Undergraduate", educationYear: 2034, educationCorpus: 800000 },
    { id: "family-child-2", name: "Kabir Mehta", relation: "Child", age: 3, dependency: "Full", needs: "Education", educationGoal: "School and university", educationYear: 2038, educationCorpus: 0 },
    { id: "family-parent", name: "Ramesh Mehta", relation: "Parent", age: 65, dependency: "Partial", needs: "Healthcare and financial security" },
  ],
  familyPriorities: ["Education", "Financial security", "Retirement"],
  salary: 250000,
  businessIncome: 0,
  annualBonus: 0,
  rentalIncome: 20000,
  dividendsIncome: 0,
  interestIncome: 0,
  otherIncome: 10000,
  household: 45000,
  schoolFees: 15000,
  emiExpenses: 60000,
  insuranceExpenses: 8500,
  lifestyle: 6500,
  healthcareExpenses: 0,
  travelExpenses: 0,
  otherExpenses: 0,
  equity: 1158140,
  mutualFunds: 2963900,
  deposits: 553800,
  gold: 691200,
  retirementCorpus: 1930400,
  cashSavings: 418600,
  propertyValue: 11500000,
  assets: [
    { id: "demo-stocks", name: "Direct equity portfolio", type: "Stocks", investedValue: 890000, currentValue: 1158140, startDate: "2022-02-01", holdingPeriod: 3.2, actualReturn: 30, expectedReturn: 11, risk: "High", liquidity: "High", taxTreatment: "Equity LTCG", incomeGenerated: 0, linkedGoal: "Wealth Creation", ownership: "Self", details: { provider: "m.Stock" } },
    { id: "demo-mutual-funds", name: "Core mutual fund portfolio", type: "Mutual Funds", investedValue: 2400000, currentValue: 2963900, startDate: "2021-06-01", holdingPeriod: 4.5, actualReturn: 12.4, expectedReturn: 10, risk: "Moderate", liquidity: "High", taxTreatment: "Equity LTCG", incomeGenerated: 0, linkedGoal: "Retirement", ownership: "Self", details: { sip: 30000, xirr: 12.4 } },
    { id: "demo-fd", name: "Family fixed deposit", type: "FD/RD", investedValue: 650000, currentValue: 650000, startDate: "2025-01-01", holdingPeriod: 1.5, actualReturn: 7.1, expectedReturn: 7.1, risk: "Low", liquidity: "Medium", taxTreatment: "Interest taxable", incomeGenerated: 0, linkedGoal: "Emergency Fund", ownership: "Self", details: { maturityMonths: 18, maturityAmount: 720000 } },
    { id: "demo-gold", name: "Gold and SGB holdings", type: "Gold/SGB", investedValue: 520000, currentValue: 691200, startDate: "2021-01-01", holdingPeriod: 5, actualReturn: 8.2, expectedReturn: 8, risk: "Moderate", liquidity: "Medium", taxTreatment: "Capital gains", incomeGenerated: 0, linkedGoal: "Wealth Creation", ownership: "Family", details: {} },
    { id: "demo-retirement", name: "EPF and NPS", type: "EPF/PPF/NPS", investedValue: 1700000, currentValue: 1930400, startDate: "2019-04-01", holdingPeriod: 7, actualReturn: 8, expectedReturn: 8, risk: "Moderate", liquidity: "Low", taxTreatment: "Retirement instruments", incomeGenerated: 0, linkedGoal: "Retirement", ownership: "Self", details: { monthlyContribution: 10000 } },
    { id: "demo-property", name: "Mumbai family home", type: "Real Estate", investedValue: 8200000, currentValue: 11500000, startDate: "2018-01-01", holdingPeriod: 8, actualReturn: 5.3, expectedReturn: 6, risk: "Moderate", liquidity: "Low", taxTreatment: "Property", incomeGenerated: 25000, linkedGoal: "Family home", ownership: "Self", details: { outstandingLoan: 3800000 } },
  ],
  homeLoanEmi: 42000,
  carLoanEmi: 18000,
  personalLoanEmi: 0,
  creditCardDues: 0,
  liabilities: [
    { id: "demo-home-loan", provider: "HDFC Bank", type: "Home Loan", originalAmount: 5500000, outstandingAmount: 3800000, interestRate: 8.4, emi: 42000, startDate: "2018-01-01", originalTenure: 20, remainingTenure: 11, endDate: "2037-01-01", rateType: "Floating", prepaymentOption: true, prepaymentPenalty: 0 },
    { id: "demo-car-loan", provider: "ICICI Bank", type: "Vehicle Loan", originalAmount: 1200000, outstandingAmount: 850000, interestRate: 9.2, emi: 18000, startDate: "2024-01-01", originalTenure: 7, remainingTenure: 4, endDate: "2029-01-01", rateType: "Floating", prepaymentOption: true, prepaymentPenalty: 2 },
    { id: "demo-card", provider: "HDFC Card", type: "Credit Card", originalAmount: 45000, outstandingAmount: 45000, interestRate: 36, emi: 5000, startDate: "2026-01-01", originalTenure: 1, remainingTenure: 1, endDate: "2026-12-01", rateType: "Fixed", prepaymentOption: true, prepaymentPenalty: 0 },
  ],
  lifeCover: 15000000,
  healthCover: 700000,
  criticalIllnessCover: 0,
  insurancePolicies: [
    { id: "demo-life-policy", insurer: "Sample Life Insurer", type: "Life", sumAssured: 12000000, premium: 32000, term: 25, startDate: "2021-08-01", renewalDate: "2026-08-01", nominee: "Priya Mehta", coveredMembers: ["Rahul Mehta"], },
    { id: "demo-health-policy", insurer: "Sample Health Insurer", type: "Health", sumAssured: 1000000, premium: 28000, term: 1, startDate: "2026-01-01", renewalDate: "2027-01-01", nominee: "Rahul Mehta", coveredMembers: ["Rahul Mehta", "Priya Mehta", "Aanya Mehta", "Kabir Mehta"], },
    { id: "demo-accident-policy", insurer: "Sample Accident Insurer", type: "Personal Accident", sumAssured: 2500000, premium: 5000, term: 1, startDate: "2026-01-01", renewalDate: "2027-01-01", nominee: "Priya Mehta", coveredMembers: ["Rahul Mehta"], },
  ],
  selectedGoals: ["retirement", "education", "home-upgrade", "emergency"],
  monthlyInvestment: 88000,
  goalDetails: {},
  goals: [
    { id: "demo-education-goal", name: "Child Education", currentAmount: 800000, targetAmount: 3500000, targetYear: 2034, duration: 8, monthlyContribution: 15000, expectedReturn: 10, inflation: 6, priority: "High", linkedInvestments: ["demo-mutual-funds"], fundingSource: "Monthly SIP" },
    { id: "demo-retirement-goal", name: "Retirement", currentAmount: 1930400, targetAmount: 40000000, targetYear: 2050, duration: 24, monthlyContribution: 20000, expectedReturn: 10, inflation: 6, priority: "High", linkedInvestments: ["demo-retirement", "demo-mutual-funds"], fundingSource: "EPF and SIP" },
    { id: "demo-travel-goal", name: "Travel", currentAmount: 200000, targetAmount: 800000, targetYear: 2028, duration: 2, monthlyContribution: 12000, expectedReturn: 7, inflation: 5, priority: "Medium", linkedInvestments: ["demo-fd"], fundingSource: "Monthly savings" },
    { id: "demo-emergency-goal", name: "Emergency Fund", currentAmount: 450000, targetAmount: 800000, targetYear: 2027, duration: 1, monthlyContribution: 6600, expectedReturn: 5, inflation: 5, priority: "High", linkedInvestments: ["demo-fd"], fundingSource: "Cash and FD" },
  ],
  nomineesOnRecord: "some",
  hasWill: false,
  riskAppetite: 7,
  horizon: 15,
  reactionToDrop: "buy",
  liquidityPreference: "Medium",
  preferredAssetClasses: ["Mutual Funds", "Stocks", "Retirement/Pension"],
  lifeEvents: ["Retirement"],
  futureEvents: [{ id: "event-retirement", event: "Retirement", year: 2050, estimatedCost: 25000000, importance: "High" }],
};

export function derivedIncome(a: OnboardingAnswers) {
  return (
    a.salary +
    a.businessIncome +
    a.annualBonus / 12 +
    a.rentalIncome +
    a.dividendsIncome +
    a.interestIncome +
    a.otherIncome
  );
}
export function derivedExpenses(a: OnboardingAnswers) {
  return (
    a.household +
    a.schoolFees +
    a.emiExpenses +
    a.insuranceExpenses +
    a.lifestyle +
    a.healthcareExpenses +
    a.travelExpenses +
    a.otherExpenses
  );
}
export function derivedEmi(a: OnboardingAnswers) {
  return a.homeLoanEmi + a.carLoanEmi + a.personalLoanEmi;
}
export function derivedAssets(a: OnboardingAnswers) {
  return (
    a.equity + a.mutualFunds + a.deposits + a.gold + a.retirementCorpus + a.cashSavings
  );
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  bullets?: string[];
  followUps?: string[];
}

export interface RMBooking {
  slot: string;
  topic: string;
  mode: "call" | "video" | "branch";
  note: string;
}

export interface SipPlan {
  monthly: number;
  years: number;
  expectedReturn: number;
  stepUp: number;
}

interface AppState {
  onboardingStatus: "not_started" | "in_progress" | "completed";
  onboardingComplete: boolean;
  answers: OnboardingAnswers;
  startOnboarding: () => void;
  saveOnboardingDraft: (answers: OnboardingAnswers) => void;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  resetOnboarding: () => void;

  scoreInputs: ScoreInputs;
  score: ScoreResult;

  whatIf: Partial<ScoreInputs>;
  setWhatIf: (patch: Partial<ScoreInputs>) => void;
  resetWhatIf: () => void;
  whatIfScore: ScoreResult;
  whatIfActive: boolean;

  goals: Goal[];
  contributions: Record<string, number>;
  setContribution: (goalId: string, amount: number) => void;
  resetContributions: () => void;
  goalsOffTrack: number;
  goalsShortfall: number;

  // Protection
  cover: CoverState;
  addLifeCover: (amount: number) => void;
  addHealthCover: (amount: number) => void;
  addCriticalIllness: (amount: number) => void;
  resetCover: () => void;
  lifeCover: number;
  healthCover: number;
  protection: number;

  // Transfer
  nominations: NominationMap;
  setNominee: (accountId: string, nominee: NomineeEntry | null) => void;
  docs: Record<string, boolean>;
  toggleDoc: (docId: string) => void;
  nominations_summary: ReturnType<typeof nominationSummary>;
  transferReadiness: number;

  // Grow
  extraSip: number;
  setExtraSip: (amount: number) => void;
  sipPlan: SipPlan;
  setSipPlan: (patch: Partial<SipPlan>) => void;
  clearedLoans: string[];
  toggleClearedLoan: (loanId: string) => void;
  taxTopUp: number;
  setTaxTopUp: (amount: number) => void;
  idleMoved: number;
  setIdleMoved: (amount: number) => void;

  actions: DerivedAction[];
  nextAction: DerivedAction | null;
  dismissedActions: string[];
  dismissAction: (id: string) => void;
  restoreActions: () => void;

  // Wealth360 framework
  riskProfile: RiskProfile;
  setRiskProfile: (p: RiskProfile) => void;
  wealthReadiness: number;
  wealthContinuity: number;
  sim: SimulatorState;
  setSim: (patch: Partial<SimulatorState>) => void;
  resetSim: () => void;
  simResult: SimulatorResult;
  dna: ReturnType<typeof financialDNA>;
  analysisSeen: boolean;
  markAnalysisSeen: () => void;

  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  clearChat: () => void;

  booking: RMBooking | null;
  setBooking: (booking: RMBooking | null) => void;

  rmOpen: boolean;
  setRmOpen: (open: boolean) => void;
  stressMode: boolean;
  setStressMode: (active: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

let messageId = 0;
const nextId = () => `m${++messageId}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [onboardingStatus, setOnboardingStatus] = useState<
    "not_started" | "in_progress" | "completed"
  >(() => {
    if (typeof window === "undefined") return "not_started";
    const stored = window.localStorage.getItem("wealth360-onboarding-status");
    return stored === "completed" || stored === "in_progress" ? stored : "not_started";
  });
  const onboardingComplete = onboardingStatus === "completed";
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);
  const [whatIf, setWhatIfState] = useState<Partial<ScoreInputs>>({});
  const [contributions, setContributions] = useState<Record<string, number>>(() =>
    Object.fromEntries(baseGoals.map((g) => [g.id, g.monthlyContribution])),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [booking, setBooking] = useState<RMBooking | null>(null);
  const [rmOpen, setRmOpen] = useState(false);
  const [stressMode, setStressMode] = useState(false);

  const [cover, setCover] = useState<CoverState>(noExtraCover);
  const [nominations, setNominations] = useState<NominationMap>(defaultNominations);
  const [docs, setDocs] = useState<Record<string, boolean>>(defaultDocs);
  const [extraSip, setExtraSip] = useState(0);
  const [sipPlan, setSipPlanState] = useState<SipPlan>({
    monthly: 88000,
    years: 15,
    expectedReturn: 12,
    stepUp: 8,
  });
  const [clearedLoans, setClearedLoans] = useState<string[]>([]);
  const [taxTopUp, setTaxTopUp] = useState(0);
  const [idleMoved, setIdleMoved] = useState(0);
  const [dismissedActions, setDismissedActions] = useState<string[]>([]);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>("Moderate");
  const [sim, setSimState] = useState<SimulatorState>(emptySim);
  const [analysisSeen, setAnalysisSeen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem("wealth360-onboarding-status", onboardingStatus);
  }, [onboardingStatus]);

  const goals = useMemo(
    () =>
      baseGoals.map((g) => ({
        ...g,
        monthlyContribution: contributions[g.id] ?? g.monthlyContribution,
      })),
    [contributions],
  );

  const projections = useMemo(
    () => goals.map((g) => ({ goal: g, p: projectGoal(g, g.monthlyContribution) })),
    [goals],
  );

  const goalsOffTrack = projections.filter((x) => !x.p.onTrack).length;
  const goalsShortfall = projections.reduce((s, x) => s + Math.max(0, x.p.gap), 0);

  const emiTotal = useMemo(() => {
    const cleared = liabilities
      .filter((l) => clearedLoans.includes(l.id))
      .reduce((s, l) => s + l.emi, 0);
    return Math.max(0, derivedEmi(answers) - cleared);
  }, [answers, clearedLoans]);

  const emergencyMonths = useMemo(() => {
    const expenses = derivedExpenses(answers);
    return expenses > 0 ? (answers.cashSavings + idleMoved * 0) / expenses : 0;
  }, [answers, idleMoved]);

  const scoreInputs = useMemo<ScoreInputs>(() => {
    const income = derivedIncome(answers);
    const expenses = derivedExpenses(answers);
    const onTrack = (projections.filter((x) => x.p.onTrack).length / projections.length) * 100;
    const funded =
      (goals.reduce((s, g) => s + Math.min(1, g.saved / g.target), 0) / goals.length) * 100;
    return {
      ...baseScoreInputs,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      monthlyInvestment: answers.monthlyInvestment + extraSip,
      monthlyEmi: emiTotal,
      emergencyMonths,
      lifeCoverMultiple: income > 0 ? totalLifeCover(cover) / (income * 12) : 0,
      healthCover: totalHealthCover(cover),
      largestAssetSharePct,
      goalFundedPct: funded,
      goalsOnTrackPct: onTrack,
    };
  }, [answers, cover, emergencyMonths, emiTotal, extraSip, goals, projections]);

  const score = useMemo(() => computeScore(scoreInputs), [scoreInputs]);

  const whatIfScore = useMemo(
    () => computeScore({ ...scoreInputs, ...whatIf }),
    [scoreInputs, whatIf],
  );

  const nominations_summary = useMemo(() => nominationSummary(nominations), [nominations]);
  const transferReadiness = useMemo(() => transferScore(nominations, docs), [nominations, docs]);
  const protection = useMemo(() => protectionScore(cover), [cover]);

  const taxHeadroom = useMemo(() => {
    const raw =
      taxSaving.section80cLimit -
      taxSaving.section80cUsed +
      (taxSaving.nps80ccdLimit - taxSaving.nps80ccdUsed) +
      (taxSaving.healthPremium80dLimit - taxSaving.healthPremium80dUsed);
    return Math.max(0, raw - taxTopUp);
  }, [taxTopUp]);

  const idleSurplus = Math.max(
    0,
    idleCash.savingsBalance - idleCash.idealBalance - idleMoved,
  );

  const actions = useMemo(
    () =>
      buildActions({
        cover,
        nominations,
        docs,
        emergencyMonths,
        emiRatioPct: (emiTotal / Math.max(1, derivedIncome(answers))) * 100,
        goalsOffTrack,
        extraSip,
        largestAssetSharePct,
        taxHeadroom,
        idleSurplus,
      }),
    [
      answers,
      cover,
      docs,
      emergencyMonths,
      emiTotal,
      extraSip,
      goalsOffTrack,
      idleSurplus,
      nominations,
      taxHeadroom,
    ],
  );

  const nextAction = useMemo(() => nextBestAction(actions), [actions]);

  const wealthReadiness = useMemo(() => readinessScore(goals), [goals]);
  const wealthContinuity = transferReadiness;

  const simResult = useMemo(
    () =>
      simulate(sim, {
        surplus: derivedIncome(answers) - derivedExpenses(answers),
        goalsOnTrack: goals.length - goalsOffTrack,
        goalsTotal: goals.length,
      }),
    [answers, goals.length, goalsOffTrack, sim],
  );

  const dna = useMemo(
    () =>
      financialDNA({
        savingsRate:
          ((derivedIncome(answers) - derivedExpenses(answers)) /
            Math.max(1, derivedIncome(answers))) *
          100,
        protection,
        emergencyMonths,
        emiRatio: (emiTotal / Math.max(1, derivedIncome(answers))) * 100,
        riskAppetite: answers.riskAppetite,
        goalsOnTrackPct: ((goals.length - goalsOffTrack) / Math.max(1, goals.length)) * 100,
      }),
    [answers, emergencyMonths, emiTotal, goals.length, goalsOffTrack, protection],
  );

  const setWhatIf = useCallback((patch: Partial<ScoreInputs>) => {
    setWhatIfState((prev) => ({ ...prev, ...patch }));
  }, []);

  const coachContext = useMemo<CoachContext>(
    () => ({
      score: score.total,
      grade: score.grade,
      pillars: score.pillars,
      lifeCover: totalLifeCover(cover),
      healthCover: totalHealthCover(cover),
      criticalIllness: cover.criticalIllness,
      protection,
      transferReadiness,
      nomineesMissing: nominations_summary.missing.map((a) => a.name),
      unnominatedValue: nominations_summary.totalValue - nominations_summary.coveredValue,
      monthlySip: answers.monthlyInvestment + extraSip,
      monthlyIncome: derivedIncome(answers),
      monthlyExpenses: derivedExpenses(answers),
      monthlyEmi: emiTotal,
      emergencyMonths,
      goalsOffTrack,
      goalsShortfall,
      taxHeadroom,
      idleSurplus,
      topAction: actions[0]?.title ?? null,
    }),
    [
      actions,
      answers,
      cover,
      emergencyMonths,
      emiTotal,
      extraSip,
      goalsOffTrack,
      goalsShortfall,
      idleSurplus,
      nominations_summary,
      protection,
      score,
      taxHeadroom,
      transferReadiness,
    ],
  );

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const reply = coachReply(trimmed, coachContext);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", text: trimmed },
        {
          id: nextId(),
          role: "assistant",
          text: reply.text,
          ...(reply.bullets ? { bullets: reply.bullets } : {}),
          ...(reply.followUps ? { followUps: reply.followUps } : {}),
        },
      ]);
    },
    [coachContext],
  );

  const value: AppState = {
    onboardingStatus,
    onboardingComplete,
    answers,
    startOnboarding: () => setOnboardingStatus("in_progress"),
    saveOnboardingDraft: (a) => {
      setAnswers(a);
      setOnboardingStatus("in_progress");
    },
    completeOnboarding: (a) => {
      setAnswers(a);
      setCover((c) => ({ ...c, criticalIllness: a.criticalIllnessCover }));
      setOnboardingStatus("completed");
    },
    resetOnboarding: () => {
      setAnswers(defaultAnswers);
      setOnboardingStatus("not_started");
    },
    scoreInputs,
    score,
    whatIf,
    setWhatIf,
    resetWhatIf: () => setWhatIfState({}),
    whatIfScore,
    whatIfActive: Object.keys(whatIf).length > 0,
    goals,
    contributions,
    setContribution: (goalId, amount) =>
      setContributions((prev) => ({ ...prev, [goalId]: amount })),
    resetContributions: () =>
      setContributions(Object.fromEntries(baseGoals.map((g) => [g.id, g.monthlyContribution]))),
    goalsOffTrack,
    goalsShortfall,

    cover,
    addLifeCover: (amount) => setCover((c) => ({ ...c, extraLife: c.extraLife + amount })),
    addHealthCover: (amount) => setCover((c) => ({ ...c, extraHealth: c.extraHealth + amount })),
    addCriticalIllness: (amount) =>
      setCover((c) => ({ ...c, criticalIllness: c.criticalIllness + amount })),
    resetCover: () => setCover(noExtraCover),
    lifeCover: totalLifeCover(cover),
    healthCover: totalHealthCover(cover),
    protection,

    nominations,
    setNominee: (accountId, nominee) =>
      setNominations((prev) => ({ ...prev, [accountId]: nominee })),
    docs,
    toggleDoc: (docId) => setDocs((prev) => ({ ...prev, [docId]: !prev[docId] })),
    nominations_summary,
    transferReadiness,

    extraSip,
    setExtraSip,
    sipPlan,
    setSipPlan: (patch) => setSipPlanState((prev) => ({ ...prev, ...patch })),
    clearedLoans,
    toggleClearedLoan: (loanId) =>
      setClearedLoans((prev) =>
        prev.includes(loanId) ? prev.filter((id) => id !== loanId) : [...prev, loanId],
      ),
    taxTopUp,
    setTaxTopUp,
    idleMoved,
    setIdleMoved,

    actions,
    nextAction,
    dismissedActions,
    dismissAction: (id) =>
      setDismissedActions((prev) => (prev.includes(id) ? prev : [...prev, id])),
    restoreActions: () => setDismissedActions([]),

    riskProfile,
    setRiskProfile,
    wealthReadiness,
    wealthContinuity,
    sim,
    setSim: (patch) => setSimState((prev) => ({ ...prev, ...patch })),
    resetSim: () => setSimState(emptySim),
    simResult,
    dna,
    analysisSeen,
    markAnalysisSeen: () => setAnalysisSeen(true),

    messages,
    sendMessage,
    clearChat: () => setMessages([]),
    booking,
    setBooking,
    rmOpen,
    setRmOpen,
    stressMode,
    setStressMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
