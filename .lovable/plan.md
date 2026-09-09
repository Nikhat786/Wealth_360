# Wealth360 — completing the product

Building on what already exists (design tokens, app shell, header/sidebar/bottom nav, RM modal, score gauge and pillars, Rahul Sharma data, shared state, score maths). Nothing existing is replaced — everything new plugs into the same shared state so a change in one place moves the numbers everywhere.

## One thing to flag first

The brief asks for React Router. This project can only use its built-in router (TanStack Router), which is already wired into every existing screen. Swapping it out isn't possible here, so navigation keeps working exactly as it does today — same links, same URLs. This is the only deviation, and it's invisible in the finished app.

## 1. Guided onboarding at /onboarding (10 steps)

Replaces the current 4-step flow with a 10-step wizard, keeping the same look and shared state:

1. Welcome and what we'll cover
2. About you — name, age, city, marital status, dependents
3. Income — salary, bonus, rental, other
4. Expenses — household, EMIs, fees, lifestyle
5. Assets — equity, funds, FDs, gold, EPF/NPS, cash, property
6. Loans — home, car, personal, credit card
7. Insurance — life, health, critical illness
8. Goals — pick goals, set target amount and year
9. Nominations and documents — nominee status per account, will, KYC
10. Risk profile — appetite, horizon, reaction to a 20% drop

Then a review screen showing derived indicators computed live: savings rate, investment rate, EMI-to-income, emergency-fund months, life-cover multiple, net worth, protection gap, nomination coverage — plus the resulting Wealth360 score and grade. Progress bar, back/next, per-step validation, and everything saved into the existing shared state.

## 2. Dashboard at /

Keeps the current layout and adds:
- A prominent **Next Best Action** hero card, chosen dynamically from the weakest pillar and the open action items, with impact ("+9 to your score") and a button that jumps to the right screen.
- Net worth strip with assets, loans and month-on-month change.
- Health score, transfer-readiness score and protection score side by side.
- Priority actions list that shrinks as items get resolved (e.g. nominations added).

## 3. Wealth map at /wealth-map

An interactive expanding tree: You → Assets / Loans / Protection / Nominations, each node expanding into categories and then individual holdings, with amounts, share of total, and colour-coded status. Selecting a node opens a side panel with detail and a relevant action. Recharts treemap alongside for the visual split.

## 4. /grow

Five tools in tabs:
- **Portfolio** — reuses the existing holdings table and allocation charts.
- **Retirement** — corpus needed vs projected, with age, spend and inflation inputs.
- **SIP simulator** — amount, years, return; growth chart and invested-vs-gains split.
- **Tax saver** — 80C / 80CCD(1B) / 80D headroom, with a slider showing tax saved.
- **Loan vs investment** — prepay the car or home loan versus investing the same amount, side by side over time.

Each tool's inputs feed the shared state so the score and actions react.

## 5. /protect

- Life cover analysis (income replacement, loans, goals, minus existing cover).
- Health cover analysis by family size and city.
- Critical illness and accident gaps.
- Illustrative product cards, each clearly labelled "Illustrative example — not a real product or quote", with indicative premiums.
- Adding a cover here updates the protection pillar and score.

## 6. /transfer

- Nomination manager listing every account (demat, funds, FDs, EPF/NPS, bank, insurance) with nominee status.
- Add or update a nominee inline — simulated, instant.
- Will and document checklist.
- Completing nominations raises the transfer-readiness score and the health score, and pops a success toast.

## 7. /coach

Extends the existing chat with contextual, Rahul-specific answers: replies quote his live numbers and change as the state changes (nominations done, SIP raised, cover added). Adds proactive insight cards above the chat drawn from his current weakest areas, plus suggested prompts that update with context.

## Wiring

One derived-state layer over the existing context: nominations, SIP changes, debt actions, insurance additions and goal edits all flow into the score inputs, the action list, the Next Best Action and the coach. No new packages, no backend. Each new page gets its own title and description.

## Technical notes

- New context slices for nominations, insurance additions, tool inputs and resolved actions; existing slices untouched.
- New derived module for transfer-readiness and protection sub-scores, layered on `computeScore` rather than replacing it.
- New routes: `wealth-map`, `grow`, `protect`, `transfer`; nav items added to the existing sidebar and bottom nav.
- Toasts via the project's existing sonner setup.
- Recharts for all charts; Lucide for icons; Tailwind tokens only, no hardcoded colours.
