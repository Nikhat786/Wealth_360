import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  IndianRupee,
  Landmark,
  PiggyBank,
  TrendingUp,
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
import { AttentionPanel } from "@/components/wealth/attention-panel";
import { StressMode } from "@/components/wealth/stress-mode";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { ScoreGauge } from "@/components/wealth/score-gauge";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { WealthMap, mapIcons, type MapNode } from "@/components/wealth/wealth-map";
import { derivedExpenses, derivedIncome, useApp } from "@/context/app-context";
import { formatINR, formatINRShort } from "@/lib/format";
import { projectGoal } from "@/lib/goal-math";
import {
  netWorthHistory,
  totalAssets,
  totalInvested,
  totalLiabilities,
  netWorth,
  user,
} from "@/lib/mock-data";

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

export function Dashboard() {
  const {
    answers,
    score,
    goals,
    protection,
    wealthReadiness,
    wealthContinuity,
    nextAction,
    stressMode,
    setStressMode,
  } = useApp();
  const income = derivedIncome(answers);
  const expenses = derivedExpenses(answers);
  const surplus = income - expenses;
  const gain = totalAssets - totalInvested;
  const mapNodes: MapNode[] = [
    {
      id: "cashflow",
      layer: "Cashflow",
      icon: mapIcons.cashflow,
      headline: `${formatINRShort(surplus)} monthly surplus`,
      detail: `${formatINRShort(income)} income against ${formatINRShort(expenses)} expenses.`,
      tone: surplus > 0 ? "success" : "destructive",
    },
    {
      id: "assets",
      layer: "Assets",
      icon: mapIcons.assets,
      headline: formatINRShort(totalAssets),
      detail: `${formatINRShort(totalInvested)} invested across your portfolio.`,
      tone: "navy",
    },
    {
      id: "goals",
      layer: "Goals",
      icon: mapIcons.goals,
      headline: `${goals.length} goals in motion`,
      detail: `${goals.filter((goal) => goal.monthlyContribution > 0).length} have active monthly contributions.`,
      tone: "gold",
    },
  ];

  if (stressMode) {
    return <AppShell><StressMode /></AppShell>;
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          as="h1"
          title={`Good morning, ${answers.name.split(" ")[0] || user.firstName}.`}
          description="Here's your financial life at a glance."
          action={
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="outline" onClick={() => setStressMode(true)}>
                Feeling overwhelmed?
              </Button>
              <Button asChild variant="outline">
                <Link to="/insights">
                  View insights <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
          }
        />

        <div className="surface-card flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-5"><ScoreGauge score={score.total} grade={score.grade} gradeLabel={score.gradeLabel} size={82} compact /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">Financial Health</p><span className="bg-gold-soft text-gold-foreground whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold">{score.grade} · {score.gradeLabel}</span></div><p className="mt-0.5 text-sm font-semibold">{score.total} / 100</p><p className="text-muted-foreground mt-0.5 hidden text-xs sm:block">Your current financial position, explained.</p></div><Button asChild variant="outline" size="sm"><Link to="/score">Understand your score <ArrowRight className="size-3.5" /></Link></Button></div>

        <section><SectionHeader title="Your Wealth360" description="Where you are today, what comes next, and what carries forward." /><div className="surface-card mt-3 grid divide-y p-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0"><Dimension label="Wealth Health" value={score.total} description="Healthy today" tone="health" /><Dimension label="Wealth Readiness" value={wealthReadiness} description="Preparing for tomorrow" tone="readiness" /><Dimension label="Wealth Continuity" value={wealthContinuity} description="Family preparedness" tone="continuity" /></div></section>

        <div className="grid gap-4 sm:grid-cols-2">
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
              value={formatINR(surplus)}
              sub={`${Math.max(0, Math.round((surplus / Math.max(1, income)) * 100))}% savings rate`}
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

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div><AttentionPanel limit={3} /></div>
          <div className="surface-card flex flex-col justify-between p-5"><div><p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">Next best action</p><h2 className="font-display mt-2 text-lg font-semibold">{nextAction?.title ?? "Your financial picture is in good shape"}</h2><p className="text-muted-foreground mt-2 text-xs leading-relaxed">{nextAction?.detail ?? "Review your Wealth360 regularly as life changes."}</p></div><Button asChild size="sm" className="mt-5 self-start"><Link to={nextAction?.to ?? "/score"}>Take action <ArrowRight className="size-3.5" /></Link></Button></div>
        </div>

        <section>
          <SectionHeader
            title="Your goals"
            description="Are you on track for the things that matter to you?"
            action={<Button asChild variant="ghost" size="sm"><Link to="/goals">View all goals <ArrowRight className="size-3.5" /></Link></Button>}
          />
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {goals
              .map((goal) => ({ goal, projection: projectGoal(goal, goal.monthlyContribution) }))
              .sort((a, b) => Number(a.projection.onTrack) - Number(b.projection.onTrack))
              .map(({ goal, projection }) => (
                <Link key={goal.id} to="/goals/$goalId" params={{ goalId: goal.id }} className="surface-card hover:shadow-raised p-4 transition-shadow">
                  <div className="flex items-start justify-between gap-2"><p className="truncate text-sm font-semibold">{goal.name}</p><span className={projection.onTrack ? "bg-success-soft text-success" : "bg-warning-soft text-warning-foreground"}>{projection.onTrack ? "On track" : "Needs attention"}</span></div>
                  <p className="text-muted-foreground num mt-2 text-xs">{formatINRShort(goal.saved)} → {formatINRShort(goal.target)} · {goal.targetYear}</p>
                  <div className="bg-muted mt-3 h-1.5 overflow-hidden rounded-full"><div className={projection.onTrack ? "bg-success h-full" : "bg-gold h-full"} style={{ width: `${Math.min(100, projection.fundedPct)}%` }} /></div>
                  <p className="text-muted-foreground num mt-2 text-[11px]">Progress {Math.round(projection.fundedPct)}%{projection.onTrack ? "" : ` · Needs ${formatINR(Math.round(projection.requiredMonthly))}/mo`}</p>
                </Link>
              ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeader
              title="Your financial X-ray"
              description="The few numbers that explain the shape of your financial life."
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <StatTile label="Monthly income" value={formatINRShort(income)} sub="All recurring inflows" />
              <StatTile label="Monthly expenses" value={formatINRShort(expenses)} sub="Household and lifestyle" />
              <StatTile label="Protection score" value={`${protection}/100`} sub="Life, health and critical illness" />
              <StatTile label="Total liabilities" value={formatINRShort(totalLiabilities)} sub="Loans and outstanding dues" />
            </div>
          </div>
          <div>
            <SectionHeader title="At a glance" description="Know what is changing before you act." />
            <div className="mt-4">
              <WealthMap nodes={mapNodes} />
            </div>
          </div>
        </div>

        <section className="surface-card p-5"><SectionHeader title="Explore Wealth360" description="Go deeper into your wealth journey." /><div className="mt-4"><PillarNav compact /></div></section>
      </div>
    </AppShell>
  );
}

function Dimension({ label, value, description, tone }: { label: string; value: number; description: string; tone: "health" | "readiness" | "continuity" }) {
  const toneClass = { health: "border-success/30", readiness: "border-primary/30", continuity: "border-gold/40" }[tone];
  return <div className={`border-l-2 px-4 py-3 first:border-l-0 ${toneClass}`}><div className="flex items-baseline justify-between gap-2"><p className="text-xs font-semibold sm:text-sm">{label}</p><p className="font-display text-xl font-semibold">{value}<span className="text-muted-foreground text-[10px] font-normal"> / 100</span></p></div><p className="text-muted-foreground mt-0.5 text-[11px]">{description}</p></div>;
}
