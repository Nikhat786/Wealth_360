import { Link, useRouterState } from "@tanstack/react-router";
import {
  Gauge,
  Headset,
  LayoutDashboard,
  Lightbulb,
  Moon,
  PieChart,
  Sun,
  Target,
  UserRound,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { RMModal } from "@/components/wealth/rm-modal";
import { useApp } from "@/context/app-context";
import { user } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import mark from "@/assets/wealth360-mark.png";

interface NavItem {
  to: "/" | "/score" | "/portfolio" | "/goals" | "/insights" | "/coach" | "/profile";
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/score", label: "My score", icon: Gauge },
  { to: "/portfolio", label: "Portfolio", icon: PieChart },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/coach", label: "AI coach", icon: MessagesSquare },
  { to: "/profile", label: "Profile", icon: UserRound },
];

const mobileNav = nav.filter((n) =>
  ["/", "/score", "/goals", "/coach", "/profile"].includes(n.to),
);

export function AppShell({ children }: { children: ReactNode }) {
  const { setRmOpen, score } = useApp();
  const [dark, setDark] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-background/85 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
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
            <Link
              to="/score"
              className="bg-gold-soft text-gold-foreground num hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold sm:flex"
            >
              Score {score.total} · {score.grade}
            </Link>
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={() => setDark((d) => !d)}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button onClick={() => setRmOpen(true)} className="gap-2">
              <Headset className="size-4" />
              <span className="hidden sm:inline">Talk to RM</span>
            </Button>
            <Link
              to="/profile"
              className="bg-primary text-primary-foreground font-display hidden size-9 items-center justify-center rounded-full text-sm font-semibold sm:flex"
              aria-label="Profile"
            >
              {user.firstName[0]}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6">
        {/* Sidebar */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 flex-col gap-1 py-6 lg:flex">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/onboarding"
            className="text-muted-foreground hover:bg-muted/60 hover:text-foreground mt-auto rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
          >
            Re-run onboarding
          </Link>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 pt-6 pb-28 lg:pb-10">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="bg-background/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur lg:hidden">
        <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
          {mobileNav.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);
            return (
              <li key={item.to} className="flex-1">
                <Link
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[11px] font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <RMModal />
    </div>
  );
}
