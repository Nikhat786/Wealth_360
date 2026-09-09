import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CalendarCheck, Headset, Mail, Phone, RefreshCw, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/wealth/app-shell";
import { SectionHeader } from "@/components/wealth/section-header";
import { derivedEmi, derivedExpenses, derivedIncome, useApp } from "@/context/app-context";
import { formatINR } from "@/lib/format";
import { rm, user } from "@/lib/mock-data";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Relationship Manager — m.Stock Wealth360" },
      {
        name: "description",
        content:
          "Your household details, risk profile, planning inputs and dedicated m.Stock relationship manager.",
      },
      { property: "og:title", content: "Profile & Relationship Manager — m.Stock Wealth360" },
      {
        property: "og:description",
        content: "Household details, risk profile and your dedicated relationship manager.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { answers, resetOnboarding, setRmOpen, booking, score } = useApp();

  return (
    <AppShell>
      <div className="space-y-8">
        <SectionHeader as="h1" title="Profile" description="Details behind your plan." />

        <div className="gradient-navy text-navy-foreground shadow-raised flex flex-wrap items-center gap-4 rounded-2xl p-6">
          <span className="bg-gold text-gold-foreground font-display flex size-16 items-center justify-center rounded-full text-xl font-semibold">
            {user.firstName[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-xl font-semibold">
              {user.name}
            </p>
            <p className="text-sm opacity-80">
              {user.city} · {user.occupation}
            </p>
            <p className="num mt-1 text-xs opacity-75">
              Client since {user.clientSince} · Score {score.total} ({score.grade})
            </p>
          </div>
          <div className="flex flex-col gap-1 text-sm opacity-90">
            <span className="flex items-center gap-2">
              <Mail className="size-4" /> {user.email}
            </span>
            <span className="flex items-center gap-2">
              <Phone className="size-4" /> {user.phone}
            </span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="surface-card p-5">
            <SectionHeader title="Planning inputs" description="Used to compute your score." />
            <dl className="mt-4 space-y-2.5 text-sm">
              <Row label="Age" value={`${answers.age}`} />
              <Row label="Dependents" value={`${answers.dependents}`} />
              <Row label="Monthly income" value={formatINR(derivedIncome(answers))} />
              <Row label="Monthly expenses" value={formatINR(derivedExpenses(answers))} />
              <Row label="Monthly investing" value={formatINR(answers.monthlyInvestment)} />
              <Row label="Monthly EMIs" value={formatINR(derivedEmi(answers))} />
              <Row label="Emergency savings" value={formatINR(answers.cashSavings)} />
              <Row label="Life cover" value={formatINR(answers.lifeCover)} />
              <Row label="Health cover" value={formatINR(answers.healthCover)} />
              <Row label="Risk appetite" value={`${answers.riskAppetite} / 10`} />
              <Row label="Horizon" value={`${answers.horizon} years`} />
            </dl>
            <Button
              asChild
              variant="outline"
              className="mt-5 w-full"
              onClick={() => resetOnboarding()}
            >
              <Link to="/onboarding">
                <RefreshCw className="mr-1.5 size-4" /> Re-run onboarding
              </Link>
            </Button>
          </div>

          <div className="surface-card p-5">
            <SectionHeader title="Your relationship manager" />
            <div className="mt-4 flex items-start gap-3">
              <span className="bg-secondary text-secondary-foreground font-display flex size-12 items-center justify-center rounded-full font-semibold">
                {rm.initials}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 font-semibold">
                  {rm.name} <BadgeCheck className="text-gold size-4" />
                </p>
                <p className="text-muted-foreground text-xs">{rm.title}</p>
                <p className="text-muted-foreground mt-1 text-xs">{rm.branch}</p>
                <div className="text-muted-foreground num mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                  <span className="flex items-center gap-1">
                    <Star className="text-gold size-3.5" /> {rm.rating}
                  </span>
                  <span>{rm.experience}</span>
                  <span>{rm.languages.join(" · ")}</span>
                </div>
              </div>
            </div>

            {booking && (
              <div className="bg-success-soft text-success mt-4 flex items-start gap-2 rounded-xl p-3 text-xs">
                <CalendarCheck className="mt-0.5 size-4 shrink-0" />
                <span>
                  Booked: {booking.topic} · {booking.slot}
                </span>
              </div>
            )}

            <Button className="mt-5 w-full gap-2" onClick={() => setRmOpen(true)}>
              <Headset className="size-4" /> Talk to {rm.name.split(" ")[0]}
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="num font-medium">{value}</dd>
    </div>
  );
}
