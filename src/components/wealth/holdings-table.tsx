import { MoneyText } from "@/components/wealth/money-text";
import { formatINR, formatPct } from "@/lib/format";
import type { Holding } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  return (
    <div className="surface-card overflow-hidden">
      {/* Desktop table */}
      <table className="hidden w-full text-sm md:table">
        <thead className="bg-muted/60 text-muted-foreground">
          <tr className="[&>th]:px-4 [&>th]:py-3 [&>th]:text-left [&>th]:text-xs [&>th]:font-semibold [&>th]:tracking-wide [&>th]:uppercase">
            <th>Holding</th>
            <th className="!text-right">Invested</th>
            <th className="!text-right">Current</th>
            <th className="!text-right">Gain / loss</th>
            <th className="!text-right">XIRR</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => {
            const gain = h.current - h.invested;
            const gainPct = (gain / h.invested) * 100;
            return (
              <tr key={h.id} className="border-t">
                <td className="px-4 py-3">
                  <p className="font-medium">{h.name}</p>
                  <p className="text-muted-foreground text-xs">{h.subtitle}</p>
                </td>
                <td className="num px-4 py-3 text-right">{formatINR(h.invested)}</td>
                <td className="num px-4 py-3 text-right font-medium">{formatINR(h.current)}</td>
                <td className="px-4 py-3 text-right">
                  <MoneyText value={gain} signed />
                  <p
                    className={cn(
                      "num text-xs",
                      gain >= 0 ? "text-success" : "text-destructive",
                    )}
                  >
                    {formatPct(gainPct)}
                  </p>
                </td>
                <td className="num px-4 py-3 text-right">{h.xirr.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile list */}
      <ul className="divide-y md:hidden">
        {holdings.map((h) => {
          const gain = h.current - h.invested;
          const gainPct = (gain / h.invested) * 100;
          return (
            <li key={h.id} className="flex items-start justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium">{h.name}</p>
                <p className="text-muted-foreground truncate text-xs">{h.subtitle}</p>
                <p className="text-muted-foreground num mt-1 text-xs">
                  XIRR {h.xirr.toFixed(1)}%
                </p>
              </div>
              <div className="text-right">
                <p className="num font-semibold">{formatINR(h.current)}</p>
                <p
                  className={cn(
                    "num text-xs",
                    gain >= 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {formatPct(gainPct)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
