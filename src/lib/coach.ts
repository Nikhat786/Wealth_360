import { formatINR, formatINRShort } from "./format";
import {
  goals,
  idleCash,
  insurance,
  largestAssetSharePct,
  monthlyCashflow,
  netWorth,
  taxSaving,
  totalAssets,
  totalLiabilities,
} from "./mock-data";

export interface CoachReply {
  text: string;
  bullets?: string[];
  followUps?: string[];
}

interface Rule {
  match: RegExp;
  reply: (score: number) => CoachReply;
}

const rules: Rule[] = [
  {
    match: /score|improve|wealth360|rating|grade/i,
    reply: (score) => ({
      text: `Your Wealth360 score is ${score}. The three fastest levers, in order of impact:`,
      bullets: [
        "Raise term cover to 10x annual income — protection is your weakest pillar (+9).",
        `Move ${formatINRShort(idleCash.savingsBalance - idleCash.idealBalance)} of idle savings into a liquid fund (+3).`,
        `Use the remaining ${formatINRShort(taxSaving.section80cLimit - taxSaving.section80cUsed)} of 80C headroom before March (+2).`,
      ],
      followUps: ["Do I have enough insurance?", "How much tax can I still save?"],
    }),
  },
  {
    match: /retire|retirement|58|pension/i,
    reply: () => {
      const g = goals.find((x) => x.id === "retirement")!;
      return {
        text: `Retirement at ${g.targetYear} needs about ${formatINRShort(g.target)}. You have ${formatINRShort(g.saved)} earmarked and contribute ${formatINR(g.monthlyContribution)} a month.`,
        bullets: [
          "At 11% expected returns that projection lands roughly 12% short.",
          `Raising the monthly contribution to ${formatINR(38000)} closes the gap.`,
          "Your EPF and NPS already do a lot of the heavy lifting here.",
        ],
        followUps: ["How can I improve my Wealth360 score?"],
      };
    },
  },
  {
    match: /concentrat|diversif|allocation|risk|small cap|equity/i,
    reply: () => ({
      text: `Your largest asset class is ${largestAssetSharePct.toFixed(0)}% of the portfolio, a little above the 35% comfort line for a moderately aggressive profile.`,
      bullets: [
        "Small caps are 24% of your equity — the band for your profile is 15-20%.",
        "You hold 6 asset classes, which is genuinely well spread.",
        "Rebalancing once a year in April is enough; no need to churn.",
      ],
      followUps: ["Am I on track for retirement?"],
    }),
  },
  {
    match: /tax|80c|80d|nps|deduction|save tax/i,
    reply: () => ({
      text: `You have ${formatINRShort(taxSaving.section80cLimit - taxSaving.section80cUsed)} of 80C headroom, ${formatINRShort(taxSaving.nps80ccdLimit - taxSaving.nps80ccdUsed)} under 80CCD(1B) and ${formatINRShort(taxSaving.healthPremium80dLimit - taxSaving.healthPremium80dUsed)} under 80D.`,
      bullets: [
        `Using all of it saves roughly ${formatINR(taxSaving.estimatedSaving)} in tax this year.`,
        "An ELSS SIP is the most flexible way to fill 80C — three-year lock-in.",
        "The NPS top-up is deductible over and above 80C.",
      ],
      followUps: ["How can I improve my Wealth360 score?"],
    }),
  },
  {
    match: /insur|cover|term|health|nominee|protect/i,
    reply: () => ({
      text: `Life cover is ${formatINRShort(insurance.lifeCover)} against an estimated need of ${formatINRShort(insurance.lifeCoverNeeded)}. Health cover is ${formatINRShort(insurance.healthCover)} against ${formatINRShort(insurance.healthCoverNeeded)}.`,
      bullets: [
        `Topping up ${formatINRShort(insurance.lifeCoverNeeded - insurance.lifeCover)} of term cover costs about ${formatINR(21000)} a year at your age.`,
        "A ₹10L family floater plus a ₹25L super top-up is the cheapest way to close the health gap.",
        "You have no critical-illness cover at all — worth ₹25L given the home loan.",
      ],
      followUps: ["How can I improve my Wealth360 score?"],
    }),
  },
  {
    match: /idle|cash|savings account|liquid|emergency/i,
    reply: () => ({
      text: `You are holding ${formatINR(idleCash.savingsBalance)} in a savings account earning ${idleCash.savingsRate}%.`,
      bullets: [
        `Keep ${formatINR(idleCash.idealBalance)} for monthly flows and move the rest to a liquid fund at ~${idleCash.liquidFundRate}%.`,
        `That is roughly ${formatINR(Math.round(((idleCash.savingsBalance - idleCash.idealBalance) * (idleCash.liquidFundRate - idleCash.savingsRate)) / 100))} of extra income a year.`,
        "Your emergency fund is at 2.5 of the 6 months you should target.",
      ],
      followUps: ["How can I improve my Wealth360 score?"],
    }),
  },
  {
    match: /net worth|networth|worth|portfolio value|total/i,
    reply: () => ({
      text: `Your net worth is ${formatINRShort(netWorth)} — ${formatINRShort(totalAssets)} of assets against ${formatINRShort(totalLiabilities)} of loans.`,
      bullets: [
        "Assets have grown 29.9% over the last twelve months.",
        "The home loan is the bulk of your liabilities and is amortising on schedule.",
      ],
      followUps: ["Is my portfolio too concentrated?"],
    }),
  },
  {
    match: /loan|emi|debt|prepay|home loan/i,
    reply: () => ({
      text: `EMIs take ${((monthlyCashflow.emi / monthlyCashflow.income) * 100).toFixed(0)}% of your monthly income, which is comfortably inside the 30% guardrail.`,
      bullets: [
        "The car loan at 9.4% is your costliest debt — clearing it first frees ₹14,200 a month.",
        "Home loan prepayment is less attractive than equity SIPs at your expected returns.",
      ],
      followUps: ["How can I improve my Wealth360 score?"],
    }),
  },
  {
    match: /rm|manager|advisor|call|human|talk/i,
    reply: () => ({
      text: "Priya Menon is your relationship manager. Use the 'Talk to RM' button in the header and I will pass this conversation along with your booking.",
      followUps: ["How can I improve my Wealth360 score?"],
    }),
  },
];

export function coachReply(question: string, score: number): CoachReply {
  for (const rule of rules) {
    if (rule.match.test(question)) return rule.reply(score);
  }
  return {
    text: `I can help with your score, goals, portfolio mix, tax, insurance, loans and cash. Here is where you stand today: a Wealth360 score of ${score} and a net worth of ${formatINRShort(netWorth)}.`,
    followUps: [
      "How can I improve my Wealth360 score?",
      "Am I on track for retirement?",
      "Do I have enough insurance?",
    ],
  };
}
