import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Headset, HeartHandshake, Lock, ShieldCheck, Sparkles, Target, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { useApp } from "@/context/app-context";

export const Route = createFileRoute("/wealth360")({
  head: () => ({
    meta: [
      { title: "Wealth360 — m.Stock" },
      { name: "description", content: "Understand your complete financial life in one intelligent journey." },
    ],
  }),
  component: Wealth360Landing,
});

const pillars = [
  ["KNOW", "Understand your complete financial life."],
  ["GROW", "Build and optimise your wealth."],
  ["PROTECT", "Protect yourself and your family."],
  ["TRANSFER", "Plan what happens to your wealth next."],
] as const;

const features = ["Net Worth", "Wealth Health", "Portfolio Analysis", "Goal Planning", "Tax Opportunities", "Insurance", "Debt Planning", "Inflation Impact", "Portfolio Rebalancing", "Nomination", "Will", "Family Wealth Vault", "AI Wealth Coach", "Wealth Map", "Life Impact Simulator"];

function Wealth360Landing() {
  const { onboardingComplete, setRmOpen } = useApp();
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  if (pathname !== "/wealth360") {
    return <Outlet />;
  }

  return (
    <AppShell minimal>
      <div className="space-y-10 pb-8">
        <section className="gradient-navy text-navy-foreground shadow-raised relative overflow-hidden rounded-2xl px-6 py-12 sm:px-10 sm:py-16">
          <div className="relative max-w-3xl">
            <span className="bg-white/10 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"><Sparkles className="size-3.5" /> m.Stock Wealth360</span>
            <h1 className="font-display mt-6 text-3xl leading-tight font-semibold sm:text-5xl">Your wealth is more than your portfolio.</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed opacity-90">Understand what you own, what you owe, what you're building and what you're leaving behind — all in one intelligent wealth journey.</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-75">One intelligent view to help you grow, protect and transfer your wealth.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90"><Link to={onboardingComplete ? "/wealth360/dashboard" : "/wealth360/journey"}>{onboardingComplete ? "Open my Wealth360" : "Get Started"}<ArrowRight className="size-4" /></Link></Button>
              <Button size="lg" variant="outline" className="border-white/25 bg-white/5 text-navy-foreground hover:bg-white/15" onClick={() => setRmOpen(true)}><Headset className="size-4" /> Talk to RM</Button>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4"><div><p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">One connected framework</p><h2 className="font-display mt-1 text-xl font-semibold">Four pillars, one financial life</h2></div><ShieldCheck className="text-success size-6" /></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{pillars.map(([name, description], index) => <div key={name} className="surface-card p-5"><span className="text-muted-foreground num text-xs">0{index + 1}</span><p className="font-display mt-5 text-sm font-semibold tracking-wide">{name}</p><p className="text-muted-foreground mt-1 text-xs leading-relaxed">{description}</p></div>)}</div>
        </section>

        <section><h2 className="font-display text-xl font-semibold">A clearer way to manage your financial life</h2><div className="mt-4 flex flex-wrap gap-2">{features.map((feature) => <span key={feature} className="bg-secondary text-secondary-foreground rounded-full px-3 py-2 text-xs font-medium">{feature}</span>)}</div></section>

        <section className="surface-card flex items-start gap-4 p-5 sm:p-6"><span className="bg-secondary text-secondary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl"><Lock className="size-5" /></span><div><h2 className="font-display text-base font-semibold">Your information. Your control.</h2><p className="text-muted-foreground mt-2 max-w-3xl text-xs leading-relaxed">You choose what to share, you can edit it later, and no transaction is performed automatically. Recommendations are informational and subject to market conditions. A production version can connect Account Aggregator with your consent.</p></div></section>

        <section className="bg-muted/60 grid gap-4 rounded-2xl p-6 sm:grid-cols-3"><div><Target className="text-primary size-5" /><p className="mt-3 text-sm font-semibold">Understand what matters now</p><p className="text-muted-foreground mt-1 text-xs">Start with a guided financial discovery journey.</p></div><div><Users className="text-primary size-5" /><p className="mt-3 text-sm font-semibold">Plan around real life</p><p className="text-muted-foreground mt-1 text-xs">Bring family, goals, risks and future changes together.</p></div><div><HeartHandshake className="text-primary size-5" /><p className="mt-3 text-sm font-semibold">Make wealth carry forward</p><p className="text-muted-foreground mt-1 text-xs">Understand nomination, continuity and the people who matter.</p></div></section>
      </div>
    </AppShell>
  );
}
