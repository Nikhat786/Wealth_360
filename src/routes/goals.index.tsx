import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/wealth/app-shell";
import { GoalCard } from "@/components/wealth/goal-card";
import { PillarNav } from "@/components/wealth/pillar-nav";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { useApp } from "@/context/app-context";
import { formatINR, formatINRShort, formatPlainPct } from "@/lib/format";
import { futureValue, projectGoal } from "@/lib/goal-math";

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
  const [selectedGoalId, setSelectedGoalId] = useState("education");
  const [whatIfMonthly, setWhatIfMonthly] = useState(20000);
  const [whatIfYears, setWhatIfYears] = useState(8);
  const [whatIfReturn, setWhatIfReturn] = useState(10);
  const projections = goals.map((g) => projectGoal(g, contributions[g.id] ?? g.monthlyContribution));
  const onTrack = projections.filter((p) => p.onTrack).length;
  const monthly = goals.reduce((s, g) => s + (contributions[g.id] ?? g.monthlyContribution), 0);
  const targetSum = goals.reduce((s, g) => s + g.target, 0);
  const savedSum = goals.reduce((s, g) => s + g.saved, 0);
  const selectedGoal = goals.find((goal) => goal.id === selectedGoalId) ?? goals[0];
  const whatIfProjected = selectedGoal
    ? futureValue(selectedGoal.saved, whatIfMonthly, whatIfReturn, whatIfYears)
    : 0;

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          as="h1"
          title="Goals"
          description="Every family goal, funded status and what it takes to stay on track."
        />

        <PillarNav />

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
            <div key={g.id} onClick={() => setSelectedGoalId(g.id)}><GoalCard goal={g} /></div>
          ))}
        </div>

        {selectedGoal && <section className="surface-card p-5"><SectionHeader title="What if?" description={`Explore a different path for ${selectedGoal.name}. Illustrative assumptions only.`} /><div className="mt-5 grid gap-5 md:grid-cols-3"><WhatIfControl label="Monthly contribution" value={whatIfMonthly} min={0} max={100000} step={5000} display={formatINR} onChange={setWhatIfMonthly} /><WhatIfControl label="Years to target" value={whatIfYears} min={1} max={30} step={1} display={(value) => `${value} years`} onChange={setWhatIfYears} /><WhatIfControl label="Expected return" value={whatIfReturn} min={6} max={12} step={1} display={(value) => `${value}%`} onChange={setWhatIfReturn} /></div><div className="bg-secondary mt-5 grid gap-4 rounded-xl p-4 sm:grid-cols-3"><Metric label="Current plan" value={formatINRShort(projectGoal(selectedGoal, selectedGoal.monthlyContribution).projected)} /><Metric label="Adjusted plan" value={formatINRShort(whatIfProjected)} /><Metric label="Target" value={formatINRShort(selectedGoal.target)} /></div><p className="text-muted-foreground mt-4 text-xs">Result: <strong className="text-foreground">{whatIfProjected >= selectedGoal.target ? "On track" : "Funding gap remains"}</strong>. Returns are illustrative and subject to market risk.</p></section>}
      </div>
    </AppShell>
  );
}

function WhatIfControl({ label, value, min, max, step, display, onChange }: { label: string; value: number; min: number; max: number; step: number; display: (value: number) => string; onChange: (value: number) => void }) {
  return <div><div className="flex items-baseline justify-between gap-2"><span className="text-sm font-medium">{label}</span><span className="num text-sm font-semibold">{display(value)}</span></div><input className="mt-3 w-full accent-[var(--color-primary)]" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>;
}
function Metric({ label, value }: { label: string; value: string }) { return <div><p className="text-muted-foreground text-[11px] font-medium uppercase">{label}</p><p className="num mt-1 text-sm font-semibold">{value}</p></div>; }
