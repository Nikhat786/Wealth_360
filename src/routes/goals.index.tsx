import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/wealth/app-shell";
import { GoalCard } from "@/components/wealth/goal-card";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { useApp } from "@/context/app-context";
import { formatINR, formatINRShort, formatPlainPct } from "@/lib/format";
import { projectGoal } from "@/lib/goal-math";

export const Route = createFileRoute("/goals/")({
  head: () => ({
    meta: [
      { title: "Goals & Projections — m.Stock Wealth360" },
      {
        name: "description",
        content:
          "Retirement, education, home, emergency fund and travel goals with live funding projections.",
      },
      { property: "og:title", content: "Goals & Projections — m.Stock Wealth360" },
      {
        property: "og:description",
        content: "Track every family goal with projections and required contributions.",
      },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  const { goals, contributions } = useApp();
  const projections = goals.map((g) => projectGoal(g, contributions[g.id] ?? g.monthlyContribution));
  const onTrack = projections.filter((p) => p.onTrack).length;
  const monthly = goals.reduce((s, g) => s + (contributions[g.id] ?? g.monthlyContribution), 0);
  const targetSum = goals.reduce((s, g) => s + g.target, 0);
  const savedSum = goals.reduce((s, g) => s + g.saved, 0);

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          as="h1"
          title="Goals"
          description="Every family goal, funded status and what it takes to stay on track."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile tone="navy" label="Goals on track" value={`${onTrack} of ${goals.length}`} />
          <StatTile label="Monthly commitment" value={formatINR(monthly)} />
          <StatTile label="Total target" value={formatINRShort(targetSum)} />
          <StatTile
            label="Funded so far"
            value={formatINRShort(savedSum)}
            sub={formatPlainPct((savedSum / targetSum) * 100, 1)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {goals.map((g) => (
            <GoalCard key={g.id} goal={g} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
