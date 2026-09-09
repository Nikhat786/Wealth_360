# m.Stock Wealth360 — prototype build

A front-end-only prototype of a wealth-management app for a demo user (Rahul Sharma). No accounts, no server, no real data — everything runs in the browser with realistic mock numbers so the whole flow can be clicked through and demoed.

## Look and feel

m.Stock-inspired: deep navy surfaces, a warm amber/gold accent for scores and highlights, crisp cards with soft elevation, tabular numerals for money. Fully responsive — bottom tab bar on phones, left sidebar on desktop. Light and dark both supported.

## Screens

1. **Onboarding** (`/onboarding`) — 4 steps: personal basics, income & expenses, goals picker, risk-profile questions. Progress bar, back/next, and a finish screen that reveals the Wealth360 score. Answers live in local state, so re-running it changes the score.
2. **Dashboard** (`/`) — greeting, Wealth360 score gauge with grade, net-worth summary, asset-allocation donut, net-worth growth line chart, goal progress cards, top action items, RM strip, AI-coach entry.
3. **Score detail** (`/score`) — score breakdown into six pillars (savings rate, protection, diversification, debt, liquidity, goal readiness) with radar chart, per-pillar bars, "what if" sliders that recompute the score live, and improvement tips.
4. **Portfolio** (`/portfolio`) — holdings table (equity, mutual funds, FDs, gold, EPF), allocation charts, gain/loss, filter tabs, XIRR-style stats.
5. **Goals** (`/goals` and `/goals/$goalId`) — goal list with progress rings; detail page with projection chart, monthly SIP needed, on-track/off-track status, and a slider to adjust contribution.
6. **Insights** (`/insights`) — cards for spending mix, tax-saving headroom, insurance gap, idle-cash alert, with supporting charts.
7. **AI Coach** (`/coach`) — chat UI with canned, rule-matched replies about the user's own numbers plus suggested prompt chips. Fully local, no model calls.
8. **Profile** (`/profile`) — user details, risk profile, documents/KYC status (mock), preferences, re-run onboarding.
9. **RM modal** — "Talk to your Relationship Manager" available from the header everywhere: RM card, slot picker, topic selector, confirmation state.

## Reusable pieces

`AppShell` (sidebar + bottom nav + header), `ScoreGauge`, `PillarBar`, `StatTile`, `MoneyText`, `GoalCard`, `ProgressRing`, `SectionHeader`, `InsightCard`, `HoldingsTable`, `EmptyState`, `RMModal`, `ChatBubble`.

## Data and state

One mock-data module holds Rahul's profile, holdings, transactions, goals, net-worth history, RM details, and coach responses. A React context stores onboarding answers, score inputs, goal contribution tweaks, and chat history for the session. Charts use Recharts.

## Technical notes

- Stack held to the requested set: Tailwind CSS, Recharts, Lucide icons, React Context. No new packages installed.
- Page navigation uses the project's built-in router (TanStack Router file routes under `src/routes`). React Router cannot be used on this project, so this is the one deviation from the brief.
- The placeholder home route is replaced by the dashboard.
- Design tokens added to `src/styles.css` (navy/gold palette, gradients, elevation) — no hardcoded colour utilities in components.
- Score engine is a pure function in `src/lib/score.ts` so onboarding, sliders, and the dashboard all agree.
- Each route gets its own page title and description.
- No backend, auth, API calls, or database, as requested.

