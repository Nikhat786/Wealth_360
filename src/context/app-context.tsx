import {
  createContext,
  useCallback,
  useContext,
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

export interface OnboardingAnswers {
  // Step 2 — about you
  name: string;
  age: number;
  city: string;
  maritalStatus: "Single" | "Married";
  dependents: number;
  // Step 3 — income
  salary: number;
  annualBonus: number;
  rentalIncome: number;
  otherIncome: number;
  // Step 4 — expenses
  household: number;
  schoolFees: number;
  lifestyle: number;
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
  // Step 9 — nominations & documents
  nomineesOnRecord: "all" | "some" | "none";
  hasWill: boolean;
  // Step 10 — risk
  riskAppetite: number;
  horizon: number;
  reactionToDrop: "sell" | "hold" | "buy";
}

export const defaultAnswers: OnboardingAnswers = {
  name: "Rahul Sharma",
  age: 34,
  city: "Mumbai",
  maritalStatus: "Married",
  dependents: 3,
  salary: 255000,
  annualBonus: 300000,
  rentalIncome: 0,
  otherIncome: 5000,
  household: 77000,
  schoolFees: 24000,
  lifestyle: 38800,
  otherExpenses: 28200,
  equity: 1158140,
  mutualFunds: 2963900,
  deposits: 553800,
  gold: 691200,
  retirementCorpus: 1930400,
  cashSavings: 418600,
  propertyValue: 11500000,
  homeLoanEmi: 42800,
  carLoanEmi: 14200,
  personalLoanEmi: 0,
  creditCardDues: 0,
  lifeCover: 15000000,
  healthCover: 700000,
  criticalIllnessCover: 0,
  selectedGoals: ["retirement", "education", "home-upgrade", "emergency"],
  monthlyInvestment: 88000,
  nomineesOnRecord: "some",
  hasWill: false,
  riskAppetite: 7,
  horizon: 15,
  reactionToDrop: "buy",
};

export function derivedIncome(a: OnboardingAnswers) {
  return a.salary + a.annualBonus / 12 + a.rentalIncome + a.otherIncome;
}
export function derivedExpenses(a: OnboardingAnswers) {
  return a.household + a.schoolFees + a.lifestyle + a.otherExpenses;
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
  onboardingComplete: boolean;
  answers: OnboardingAnswers;
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

  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  clearChat: () => void;

  booking: RMBooking | null;
  setBooking: (booking: RMBooking | null) => void;

  rmOpen: boolean;
  setRmOpen: (open: boolean) => void;
}

const AppContext = createContext<AppState | null>(null);

let messageId = 0;
const nextId = () => `m${++messageId}`;

export function AppProvider({ children }: { children: ReactNode }) {
  const [onboardingComplete, setOnboardingComplete] = useState(true);
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);
  const [whatIf, setWhatIfState] = useState<Partial<ScoreInputs>>({});
  const [contributions, setContributions] = useState<Record<string, number>>(() =>
    Object.fromEntries(baseGoals.map((g) => [g.id, g.monthlyContribution])),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [booking, setBooking] = useState<RMBooking | null>(null);
  const [rmOpen, setRmOpen] = useState(false);

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
    onboardingComplete,
    answers,
    completeOnboarding: (a) => {
      setAnswers(a);
      setCover((c) => ({ ...c, criticalIllness: a.criticalIllnessCover }));
      setOnboardingComplete(true);
    },
    resetOnboarding: () => {
      setAnswers(defaultAnswers);
      setOnboardingComplete(false);
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

    messages,
    sendMessage,
    clearChat: () => setMessages([]),
    booking,
    setBooking,
    rmOpen,
    setRmOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
