import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  IndianRupee,
  Landmark,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { GoalCard } from "@/components/wealth/goal-card";
import { ScoreGauge } from "@/components/wealth/score-gauge";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { useApp } from "@/context/app-context";
import { formatINR, formatINRShort } from "@/lib/format";
import {
  actionItems,
  monthlyCashflow,
  netWorthHistory,
  recentTransactions,
  totalAssets,
  totalInvested,
  totalLiabilities,
  netWorth,
  user,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wealth360 Dashboard — m.Stock" },
      {
        name: "description",
        content:
          "Your net worth, Wealth360 score, goals and next best actions in one premium dashboard.",
      },
      { property: "og:title", content: "Wealth360 Dashboard — m.Stock" },
      {
        property: "og:description",
        content: "Track net worth, score, goals and next best actions in one place.",
      },
    ],
  }),
  component: Dashboard,
});

const severityStyles = {
  high: "bg-destructive-soft text-destructive",
  medium: "bg-gold-soft text-gold-foreground",
  low: "bg-secondary text-secondary-foreground",
};

function Dashboard() {
  const { score, goals } = useApp();
  const gain = totalAssets - totalInvested;

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          as="h1"
          title={`Good to see you, ${user.firstName}`}
          description="Here's how your money is doing today."
          action={
            <Button asChild variant="outline">
              <Link to="/insights">
                View insights <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          }
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="surface-card flex items-center gap-5 p-5 lg:col-span-1">
            <ScoreGauge
              score={score.total}
              grade={score.grade}
              gradeLabel={score.gradeLabel}
              size={148}
            />
            <div className="min-w-0 space-y-2">
              <p className="text-sm font-semibold">Wealth360 score</p>
              <p className="text-muted-foreground text-xs">
                Weakest pillar: {score.pillars.slice().sort((a, b) => a.score - b.score)[0]?.label}
              </p>
              <Button asChild size="sm" variant="secondary">
                <Link to="/score">See breakdown</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <StatTile
              tone="navy"
              label="Net worth"
              value={formatINRShort(netWorth)}
              sub="Assets minus liabilities"
              change={4.2}
              icon={Landmark}
            />
            <StatTile
              label="Total assets"
              value={formatINRShort(totalAssets)}
              sub={`${formatINRShort(gain)} unrealised gain`}
              change={2.8}
              icon={TrendingUp}
            />
            <StatTile
              label="Liabilities"
              value={formatINRShort(totalLiabilities)}
              sub="Home and car loans"
              change={-1.1}
              icon={IndianRupee}
            />
            <StatTile
              label="Monthly investing"
              value={formatINR(monthlyCashflow.investments)}
              sub={`of ${formatINR(monthlyCashflow.income)} income`}
              icon={PiggyBank}
            />
          </div>
        </div>

        <div className="surface-card p-5">
          <SectionHeader
            title="Net worth trend"
            description="Last 12 months of assets against liabilities."
          />
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={netWorthHistory}>
                <defs>
                  <linearGradient id="assetsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="liabFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                <YAxis
                  tickFormatter={(v: number) => formatINRShort(v)}
                  tickLine={false}
                  axisLine={false}
                  width={64}
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
                <Area
                  type="monotone"
                  dataKey="assets"
                  name="Assets"
                  stroke="var(--color-primary)"
                  fill="url(#assetsFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="liabilities"
                  name="Liabilities"
                  stroke="var(--color-gold)"
                  fill="url(#liabFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <SectionHeader
            title="Next best actions"
            description="Ordered by the score impact each one unlocks."
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {actionItems.map((a) => (
              <div key={a.id} className="surface-card flex items-start gap-3 p-4">
                <span
                  className={cn(
                    "num rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    severityStyles[a.severity],
                  )}
                >
                  {a.impact}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader
            title="Your goals"
            description="Five goals tracked with live projections."
            action={
              <Button asChild variant="ghost" size="sm">
                <Link to="/goals">All goals</Link>
              </Button>
            }
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {goals.slice(0, 3).map((g) => (
              <GoalCard key={g.id} goal={g} compact />
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <SectionHeader title="Recent activity" description="Last six money movements." />
          <ul className="mt-3 divide-y">
            {recentTransactions.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <span className="bg-muted text-muted-foreground flex size-9 items-center justify-center rounded-xl">
                  <Wallet className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.label}</p>
                  <p className="text-muted-foreground num text-xs">{t.date}</p>
                </div>
                <span
                  className={cn(
                    "num text-sm font-semibold",
                    t.amount < 0 ? "text-foreground" : "text-success",
                  )}
                >
                  {t.amount < 0 ? "−" : "+"}
                  {formatINR(Math.abs(t.amount))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
