import { createFileRoute } from "@tanstack/react-router";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { AppShell } from "@/components/wealth/app-shell";
import { HoldingsTable } from "@/components/wealth/holdings-table";
import { SectionHeader } from "@/components/wealth/section-header";
import { StatTile } from "@/components/wealth/stat-tile";
import { formatINR, formatINRShort, formatPlainPct } from "@/lib/format";
import {
  allocation,
  holdings,
  liabilities,
  totalAssets,
  totalInvested,
  totalLiabilities,
} from "@/lib/mock-data";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio & Allocation — m.Stock Wealth360" },
      {
        name: "description",
        content:
          "Every holding, asset-class mix, XIRR and outstanding loans across your household portfolio.",
      },
      { property: "og:title", content: "Portfolio & Allocation — m.Stock Wealth360" },
      {
        property: "og:description",
        content: "Holdings, asset allocation, returns and loans in one view.",
      },
    ],
  }),
  component: PortfolioPage,
});

const palette = [
  "var(--color-primary)",
  "var(--color-gold)",
  "var(--color-success)",
  "var(--color-chart-4, #7c93b8)",
  "var(--color-chart-5, #c8b273)",
  "var(--color-muted-foreground)",
];

function PortfolioPage() {
  const gain = totalAssets - totalInvested;
  const gainPct = (gain / totalInvested) * 100;

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader
          as="h1"
          title="Portfolio"
          description={`${holdings.length} holdings across ${allocation.length} asset classes.`}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile tone="navy" label="Current value" value={formatINRShort(totalAssets)} />
          <StatTile label="Invested" value={formatINRShort(totalInvested)} />
          <StatTile
            label="Unrealised gain"
            value={formatINRShort(gain)}
            sub={`${formatPlainPct(gainPct, 1)} overall`}
            change={Number(gainPct.toFixed(1))}
          />
          <StatTile label="Loans outstanding" value={formatINRShort(totalLiabilities)} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,380px)_1fr]">
          <div className="surface-card p-5">
            <SectionHeader title="Asset allocation" />
            <div className="mt-2 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {allocation.map((_, i) => (
                      <Cell key={i} fill={palette[i % palette.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => formatINR(Number(v))}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-2">
              {allocation.map((a, i) => (
                <li key={a.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: palette[i % palette.length] }}
                  />
                  <span className="flex-1 truncate">{a.name}</span>
                  <span className="num text-muted-foreground">
                    {formatPlainPct(a.share, 1)}
                  </span>
                  <span className="num font-medium">{formatINRShort(a.value)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-card overflow-hidden p-5">
            <SectionHeader title="Holdings" description="Sorted by current value." />
            <div className="mt-4">
              <HoldingsTable holdings={holdings} />
            </div>
          </div>
        </div>

        <div className="surface-card p-5">
          <SectionHeader title="Loans" description="Outstanding balances and EMIs." />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {liabilities.map((l) => (
              <div key={l.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-muted-foreground text-xs">{l.lender}</p>
                  </div>
                  <p className="num font-semibold">{formatINRShort(l.outstanding)}</p>
                </div>
                <div className="text-muted-foreground num mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <span>EMI {formatINR(l.emi)}</span>
                  <span>{l.rate}% p.a.</span>
                  <span>{l.tenureLeft} left</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
