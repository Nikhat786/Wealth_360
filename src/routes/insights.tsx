import { createFileRoute } from "@tanstack/react-router";
import { Banknote, HeartPulse, PieChart as PieIcon, Receipt, ShieldCheck } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AppShell } from "@/components/wealth/app-shell";
import { InsightCard } from "@/components/wealth/insight-card";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { formatINR, formatINRShort, formatPlainPct } from "@/lib/format";
import {
  idleCash,
  insurance,
  largestAssetSharePct,
  monthlyCashflow,
  spendingBreakdown,
  taxSaving,
} from "@/lib/mock-data";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — m.Stock Wealth360" },
      {
        name: "description",
        content:
          "Cash flow, spending, insurance gaps, tax headroom and idle cash insights for your household.",
      },
      { property: "og:title", content: "Insights — m.Stock Wealth360" },
      {
        property: "og:description",
        content: "Cash flow, protection gaps, tax headroom and idle cash, explained.",
      },
    ],
  }),
  component: InsightsPage,
});

const palette = [
  "var(--color-primary)",
  "var(--color-gold)",
  "var(--color-success)",
  "var(--color-muted-foreground)",
];

function InsightsPage() {
  const surplus =
    monthlyCashflow.income -
    monthlyCashflow.expenses -
    monthlyCashflow.emi -
    monthlyCashflow.investments;
  const idleExcess = idleCash.savingsBalance - idleCash.idealBalance;
  const lifeGap = monthlyCashflow.income * 12 * 10 - insurance.lifeCover;
  const c80Left = taxSaving.section80cLimit - taxSaving.section80cUsed;

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          as="h1"
          title="Insights"
          description="What your numbers say, and the one move that follows from each."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile tone="navy" label="Monthly income" value={formatINR(monthlyCashflow.income)} />
          <StatTile label="Expenses" value={formatINR(monthlyCashflow.expenses)} />
          <StatTile label="EMIs" value={formatINR(monthlyCashflow.emi)} />
          <StatTile
            label="Unallocated surplus"
            value={formatINR(surplus)}
            sub={surplus > 0 ? "Available to invest" : "Overcommitted"}
          />
        </div>

        <div className="surface-card p-5">
          <SectionHeader title="Where the money goes" description="Average monthly spending." />
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingBreakdown} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => formatINRShort(v)}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={130}
                  fontSize={11}
                />
                <Tooltip
                  formatter={(v) => formatINR(Number(v))}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {spendingBreakdown.map((_, i) => (
                    <Cell key={i} fill={palette[i % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <InsightCard
            icon={ShieldCheck}
            tone="destructive"
            title="Protection gap"
            headline={`Top up term cover by ${formatINRShort(lifeGap)}`}
            detail={`Your life cover of ${formatINRShort(insurance.lifeCover)} is ${(
              insurance.lifeCover /
              (monthlyCashflow.income * 12)
            ).toFixed(1)}x annual income. The healthy benchmark is 10x.`}
          />
          <InsightCard
            icon={HeartPulse}
            tone="gold"
            title="Health cover"
            headline={`${formatINRShort(insurance.healthCover)} family floater`}
            detail="A ₹10 L base with a super top-up costs little more and covers a metro hospitalisation comfortably."
          />
          <InsightCard
            icon={Receipt}
            tone="success"
            title="Tax headroom"
            headline={`${formatINR(c80Left)} of 80C left`}
            detail={`Using it before 31 March saves roughly ${formatINR(
              Math.round(c80Left * 0.312),
            )} in tax at your slab.`}
          />
          <InsightCard
            icon={Banknote}
            tone="primary"
            title="Idle cash"
            headline={`${formatINRShort(idleExcess)} sitting in savings`}
            detail={`Savings pays ${idleCash.savingsRate}% against ${idleCash.liquidFundRate}% in a liquid fund — about ${formatINR(
              Math.round((idleExcess * (idleCash.liquidFundRate - idleCash.savingsRate)) / 100),
            )} a year foregone.`}
          />
          <InsightCard
            icon={PieIcon}
            tone="gold"
            title="Concentration"
            headline={`Largest asset class is ${formatPlainPct(largestAssetSharePct, 1)}`}
            detail="Keeping any single asset class under 45% smooths your drawdowns without hurting long-run returns."
            className="md:col-span-2"
          />
        </div>
      </div>
    </AppShell>
  );
}
