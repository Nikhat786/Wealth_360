import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { AppShell } from "@/components/wealth/app-shell";
import { SectionHeader } from "@/components/wealth/section-header";
import { defaultAnswers, useApp, type OnboardingAnswers } from "@/context/app-context";
import { formatINR } from "@/lib/format";
import { goals as baseGoals } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your Wealth360 plan — m.Stock" },
      {
        name: "description",
        content:
          "Four quick steps: your household, your cash flow, your protection and your goals and risk appetite.",
      },
      { property: "og:title", content: "Set up your Wealth360 plan — m.Stock" },
      {
        property: "og:description",
        content: "Answer four short steps to generate your Wealth360 score.",
      },
    ],
  }),
  component: Onboarding,
});

const steps = ["About you", "Cash flow", "Protection", "Goals & risk"];

function Onboarding() {
  const { answers, completeOnboarding } = useApp();
  const [draft, setDraft] = useState<OnboardingAnswers>(answers ?? defaultAnswers);
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const set = <K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const finish = () => {
    completeOnboarding(draft);
    void navigate({ to: "/" });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <SectionHeader
          as="h1"
          title="Let's build your plan"
          description={`Step ${step + 1} of ${steps.length} — ${steps[step]}`}
        />

        <div className="flex gap-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i <= step ? "bg-primary" : "bg-muted",
              )}
            />
          ))}
        </div>

        <div className="surface-card space-y-5 p-5">
          {step === 0 && (
            <>
              <Field label="Your name">
                <Input value={draft.name} onChange={(e) => set("name", e.target.value)} />
              </Field>
              <NumberField label="Age" value={draft.age} onChange={(v) => set("age", v)} />
              <NumberField
                label="Dependents"
                value={draft.dependents}
                onChange={(v) => set("dependents", v)}
              />
            </>
          )}

          {step === 1 && (
            <>
              <NumberField
                label="Monthly income"
                value={draft.monthlyIncome}
                onChange={(v) => set("monthlyIncome", v)}
                money
              />
              <NumberField
                label="Monthly expenses"
                value={draft.monthlyExpenses}
                onChange={(v) => set("monthlyExpenses", v)}
                money
              />
              <NumberField
                label="Monthly investing"
                value={draft.monthlyInvestment}
                onChange={(v) => set("monthlyInvestment", v)}
                money
              />
              <NumberField
                label="Monthly EMIs"
                value={draft.monthlyEmi}
                onChange={(v) => set("monthlyEmi", v)}
                money
              />
            </>
          )}

          {step === 2 && (
            <>
              <NumberField
                label="Emergency savings"
                value={draft.emergencySavings}
                onChange={(v) => set("emergencySavings", v)}
                money
              />
              <NumberField
                label="Life cover"
                value={draft.lifeCover}
                onChange={(v) => set("lifeCover", v)}
                money
              />
              <NumberField
                label="Health cover"
                value={draft.healthCover}
                onChange={(v) => set("healthCover", v)}
                money
              />
            </>
          )}

          {step === 3 && (
            <>
              <Field label="Which goals matter most?">
                <div className="flex flex-wrap gap-2">
                  {baseGoals.map((g) => {
                    const active = draft.selectedGoals.includes(g.id);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() =>
                          set(
                            "selectedGoals",
                            active
                              ? draft.selectedGoals.filter((id) => id !== g.id)
                              : [...draft.selectedGoals, g.id],
                          )
                        }
                        className={cn(
                          "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                          active
                            ? "bg-primary text-primary-foreground border-transparent"
                            : "hover:bg-muted",
                        )}
                      >
                        {active && <Check className="size-3.5" />}
                        {g.name}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label={`Risk appetite — ${draft.riskAppetite} / 10`}>
                <Slider
                  value={[draft.riskAppetite]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(v) => set("riskAppetite", v[0] ?? 5)}
                />
              </Field>

              <Field label={`Investment horizon — ${draft.horizon} years`}>
                <Slider
                  value={[draft.horizon]}
                  min={1}
                  max={30}
                  step={1}
                  onValueChange={(v) => set("horizon", v[0] ?? 10)}
                />
              </Field>

              <Field label="Markets drop 20%. You…">
                <div className="flex flex-wrap gap-2">
                  {(["sell", "hold", "buy"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => set("reactionToDrop", r)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                        draft.reactionToDrop === r
                          ? "bg-primary text-primary-foreground border-transparent"
                          : "hover:bg-muted",
                      )}
                    >
                      {r === "sell" ? "Sell some" : r === "hold" ? "Hold tight" : "Buy more"}
                    </button>
                  ))}
                </div>
              </Field>
            </>
          )}
        </div>

        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ArrowLeft className="mr-1.5 size-4" /> Back
          </Button>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Continue <ArrowRight className="ml-1.5 size-4" />
            </Button>
          ) : (
            <Button onClick={finish}>
              See my score <ArrowRight className="ml-1.5 size-4" />
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  money,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  money?: boolean;
}) {
  return (
    <Field label={money ? `${label} — ${formatINR(value)}` : label}>
      <Input
        type="number"
        className="num"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </Field>
  );
}
