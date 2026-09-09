import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Headset } from "lucide-react";
import { useEffect, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { RMModal } from "@/components/wealth/rm-modal";
import { CoachPopover } from "@/components/wealth/coach-popover";
import { useApp } from "@/context/app-context";
import { user } from "@/lib/mock-data";
import mark from "@/assets/wealth360-mark.png";

export function AppShell({ children, minimal = false }: { children: ReactNode; minimal?: boolean }) {
  const { setRmOpen, score, onboardingComplete } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    const publicPath =
      pathname === "/wealth360" ||
      pathname === "/welcome" ||
      pathname === "/onboarding" ||
      pathname === "/analysis" ||
      pathname === "/wealth360/journey" ||
      pathname === "/wealth360/analysis";
    if (!minimal && !onboardingComplete && !publicPath) {
      void navigate({ to: "/wealth360/journey" });
    }
  }, [minimal, navigate, onboardingComplete, pathname]);

  const publicPath =
    pathname === "/wealth360" ||
    pathname === "/welcome" ||
    pathname === "/onboarding" ||
    pathname === "/analysis" ||
    pathname === "/wealth360/journey" ||
    pathname === "/wealth360/analysis";

  if (!minimal && !onboardingComplete && !publicPath) {
    return <div className="min-h-screen bg-background" aria-hidden="true" />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-background/85 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to={minimal ? "/wealth360" : "/"} className="flex items-center gap-2.5">
            <img
              src={mark}
              alt="m.Stock Wealth360"
              width={512}
              height={512}
              className="size-8"
            />
            <span className="font-display text-base leading-none font-semibold">
              m.Stock
              <span className="text-muted-foreground ml-1 font-normal">Wealth360</span>
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            {!minimal && (
              <Link
                to="/score"
                className="bg-gold-soft text-gold-foreground num hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold sm:flex"
              >
                Score {score.total} · {score.grade}
              </Link>
            )}
            <Button onClick={() => setRmOpen(true)} className="gap-2">
              <Headset className="size-4" />
              <span className="hidden sm:inline">Talk to RM</span>
            </Button>
            {!minimal && (
              <Link
                to="/profile"
                className="bg-primary text-primary-foreground font-display hidden size-9 items-center justify-center rounded-full text-sm font-semibold sm:flex"
                aria-label="Profile"
              >
                {user.firstName[0]}
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto min-w-0 max-w-7xl px-4 pt-6 pb-10 sm:px-6">{children}</main>

      {!minimal && (
        <CoachPopover />
      )}

      <RMModal />
    </div>
  );
}
