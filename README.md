# Wealth Operating System

Continue building on my existing React app in the repo NikhatMirae/wealth360-prototype. Do not rebuild from scratch, change the theme, or remove working features. Reuse the current AppShell, AppContext, routes, mock data, ScoreGauge, GoalCard, InsightCard, StatTile, charts, RMModal, Wealth Coach, and existing m.Stock styling. Follow the uploaded Wealth360 spec to extend the app into a complete financial framework (KNOW → GROW → PROTECT → PLAN → TRANSFER). Use mock data and local state only — no backend integration. Keep the current m.Stock theme and architecture intact.
Continue building the EXISTING m.Stock Wealth360 React app. Do NOT rebuild from scratch, change the existing theme, remove working features, or duplicate existing components. Reuse the current AppShell, AppContext, routes, mock data, ScoreGauge, GoalCard, InsightCard, StatTile, charts, RMModal, Wealth Coach and existing m.Stock styling.

GOAL:

Transform Wealth360 into a complete, clean, premium, easy-to-use financial wealth-management framework:

KNOW → GROW → PROTECT → PLAN → TRANSFER

The experience should feel like a personal financial operating system, not a normal investment dashboard.

==================================================

1. ENTRY + WELCOME

==================================================

Existing m.Stock homepage:

Add a prominent Wealth360 entry/section.

Wealth360 Welcome:

Headline: “Your wealth is more than your portfolio.”

Subtext: Bring investments, cashflows, goals, protection, debt and family wealth into one intelligent view.

Show 5 pillars:

KNOW | GROW | PROTECT | PLAN | TRANSFER

Show benefits:

• Goal-based investing

• Net-worth tracking

• Wealth Health Score

• Cashflow & liability management

• Protection analysis

• Tax optimisation opportunities

• Wealth transfer planning

• AI-powered recommendations

CTAs:

[Start My Wealth360]

[Connect with RM]

==================================================

2. FINANCIAL JOURNEY / ONBOARDING

==================================================

Enhance existing onboarding into a beautiful multi-step “Understand Your Financial Life” journey.

Show progress and allow Back/Next/Edit.

STEP 1 — PERSONAL

• Name

• Age

• Gender (optional)

• Marital status

• Occupation

• Employer/business

• Annual income

• Monthly income

• Dependents

• Life stage derived from age/family

STEP 2 — FAMILY

Allow multiple:

• Spouse

• Children

• Parents

• Other dependents

For children capture age and future education requirement.

STEP 3 — CASHFLOW

Income:

• Salary

• Business

• Rental

• Dividends

• Other income

Expenses:

• Household

• Education

• EMI

• Insurance

• Lifestyle

• Other

Calculate:

• Monthly income

• Monthly expenses

• Monthly surplus

• Savings rate

STEP 4 — ASSETS & INVESTMENTS

For each asset:

• Type

• Current value

• Invested value

• Purchase/investment date

• Duration

• ROI/return

• Liquidity

• Risk level

• Linked goal

Include:

• Savings

• FD

• Stocks

• Mutual Funds

• ETFs

• Bonds

• Gold

• Real Estate

• Retirement/Pension

• Other assets

STEP 5 — LIABILITIES

For each liability:

• Type

• Outstanding amount

• Original amount

• Interest rate/ROI

• EMI

• Start date

• Remaining tenure

• End date

Include:

• Home loan

• Personal loan

• Vehicle loan

• Credit card

• Other debt

Calculate debt-to-income ratio.

STEP 6 — GOALS

Allow:

• Retirement

• Child education

• Home

• Emergency fund

• Travel

• Wealth creation

• Career break

• Business

• Custom goal

For each:

• Current amount

• Target amount

• Target year/date

• Duration

• Monthly contribution

• Priority

• Current progress

STEP 7 — INSURANCE / PROTECTION

Capture user + family:

• Life insurance

• Health insurance

• Personal accident

• Existing cover

• Premium

• Policy duration

• Renewal date

STEP 8 — RISK PROFILE

Conservative / Moderate / Aggressive.

Capture investment horizon and liquidity preference.

STEP 9 — PREFERENCES

• Monthly investment capacity

• Preferred asset classes

• Financial priorities

• Future plans/life events:

  marriage, baby, job change, career break, home purchase, business, travel, relocation, retirement etc.

Final CTA:

[Generate My Wealth360]

IMPORTANT:

For this prototype use MOCK DATA and React state/localStorage only.

Do NOT integrate Account Aggregator now.

Design the architecture so AA can replace manual financial data later. Mention “Connect via Account Aggregator” as a future capability, but keep the current prototype manual/mock.

==================================================

3. ANALYSIS EXPERIENCE

==================================================

After onboarding show a short premium analysis screen:

“Building your Wealth360…”

Analyse:

✓ Cashflow

✓ Net worth

✓ Investments

✓ Liabilities

✓ Goals

✓ Insurance

✓ Risk

✓ Tax opportunities

✓ Portfolio diversification

✓ Nomination

✓ Wealth continuity

Then open dashboard.

==================================================

4. CONSOLIDATED WEALTH360 DASHBOARD

==================================================

Make the dashboard the command centre.

Header:

“Good morning, Rahul. Here’s your financial life at a glance.”

Top cards:

• Net Worth

• Wealth Health Score

• Monthly Surplus

• Protection Score

Show 3 primary scores:

WEALTH HEALTH — financial health today

WEALTH READINESS — preparedness for future goals

WEALTH CONTINUITY — preparedness for family/wealth transfer

Wealth Health Score:

0–100 with existing score logic:

Grow 40%

Protect 25%

Plan 15%

Transfer 20%

Show pillar scores:

Grow | Protect | Plan | Transfer

NET WORTH:

• Assets

• Liabilities

• Net worth

• Historical trend

• Assets vs liabilities chart

INVESTMENTS:

• Portfolio value

• Asset allocation

• Performance

• Diversification

• Risk exposure

GOALS:

• Progress

• Projected completion

• Funding gap

• Inflation-adjusted target

LIABILITIES:

• Total debt

• Debt-to-income

• Interest rates

• Debt-free forecast

==================================================

5. “WHAT NEEDS YOUR ATTENTION?”

==================================================

Create a prominent AI priority engine.

Show 3–5 actionable recommendations with:

• Priority

• Problem

• Why it matters

• Estimated impact

• Suggested action

• “Why am I seeing this?”

• Assumptions used

• Risk level

• [Take Action]

Examples:

• Protection gap

• High-interest debt

• Retirement shortfall

• Portfolio concentration

• Tax opportunity

• Missing nomination

• Low emergency fund

Do NOT imply guaranteed profitability.

Every market-linked recommendation must clearly state:

“Returns are market-linked and subject to market risk. Past performance does not guarantee future results.”

Recommendations should optimise overall financial health, NOT simply returns.

==================================================

6. KNOW — WEALTH MAP

==================================================

Create Wealth Map showing:

PERSON

↓

FAMILY

↓

INCOME / CASHFLOW

↓

ASSETS

↓

LIABILITIES

↓

GOALS

↓

PROTECTION

↓

WEALTH TRANSFER

Allow users to visually understand their entire financial life.

Add “Financial X-Ray”:

Assets | Debt | Net Worth | Investments | Insurance | Goals

==================================================

7. GROW

==================================================

Restructure existing Portfolio + Goals under GROW.

Include:

• Portfolio overview

• Asset allocation

• Investment risk profile

• Goal-linked investments

• Portfolio diversification

• Rebalancing

• Goals

• Inflation impact

• Tax Saver

• Debt Planner

• FD/deposit opportunities

REBALANCING:

Show Current vs Target allocation and suggested changes.

No real trade execution.

TAX SAVER:

Show mock opportunities such as ELSS/NPS/insurance/home-loan related options.

Show assumptions and “illustrative only”.

DEBT PLANNER:

Compare:

• Current repayment

• High-interest-first

• Balanced debt + investing

Show estimated interest saving and debt-free date.

INFLATION:

Show today’s cost vs future cost for each goal.

==================================================

8. PROTECT

==================================================

Create Protection dashboard.

Show:

• Protection Score

• Life cover required vs existing

• Health cover required vs existing

• Emergency fund required vs existing

• Family protection gaps

Add “Explore Protection Options”.

Mock comparison for:

• Term insurance

• Health insurance

• Personal accident

etc.

Recommendations should consider:

age, income, dependents, liabilities and goals.

Never claim a product is universally “best”.

Show:

Coverage | Premium | Term | Suitability | Key assumptions

==================================================

9. PLAN

==================================================

Use Goals as the planning engine.

Show:

• Retirement readiness

• Child education

• Emergency fund

• Home

• Travel

• Career break

• Business

• Financial independence

Add LIFE IMPACT SIMULATOR:

“What if…?”

• Increase SIP

• Repay loan

• Take career break

• Change job

• Have a baby

• Buy a house

• Inflation increases

• Reduce monthly investment

Show impact on:

Net worth

Goals

Cashflow

Debt

Wealth Health

==================================================

10. TRANSFER

==================================================

Create Transfer section.

Show:

WEALTH CONTINUITY SCORE

NOMINATION:

• Assets covered

• Missing nominations

• Nominee relationship

• Allocation %

Allow mock nomination completion and update score.

WILL:

Status:

Created / Not Created / Needs Review

Buttons:

[Start Will Journey]

[Connect with Legal Expert]

Do NOT create legally valid documents.

==================================================

11. FAMILY WEALTH VAULT

==================================================

Create Family Wealth Vault.

Sections:

FINANCIAL:

• Investments

• Bank/FD

• Insurance

• Property

• Loans

SUCCESSION:

• Nomination

• Will

• Beneficiaries

EMERGENCY:

• Family financial summary

• RM details

• Insurance contacts

• Important financial information

Add:

“Family Financial Emergency Card”

Show:

Investment accounts

Insurance policies

Loans

Nomination status

Will status

RM

Use mock data and secure/lock visual language.

==================================================

12. UNIQUE FEATURES

==================================================

Add these where they naturally fit:

A. FINANCIAL DNA

Create a personalised profile based on:

Age, income, family, risk, investments, debt and goals.

Example:

“Balanced Wealth Builder”

Show:

Growth | Protection | Liquidity | Discipline | Risk | Planning

B. FINANCIAL STRESS-FREE MODE

Instead of overwhelming users with every recommendation:

“Don’t worry about everything. We’ll prioritise it.”

Show:

TODAY

THIS YEAR

LATER

C. WEALTH AUTOPILOT

Mock proactive alerts:

• Equity allocation outside preferred range

• FD maturity approaching

• Insurance renewal

• Goal falling behind

• Nomination missing

• Portfolio review due

No automatic transactions.

D. WEALTH CALENDAR

Show upcoming:

FD maturity

Insurance renewal

Tax planning

SIP review

EMI milestone

Goal milestone

Portfolio review

E. RECOMMENDATION CONFIDENCE

Every recommendation shows:

Potential Impact

Risk

Confidence

F. “WHY AM I SEEING THIS?”

Explain recommendation using user data and assumptions.

G. “HUMAN + AI”

AI identifies opportunities.

RM handles complex/personalised guidance.

==================================================

13. PRODUCT / OPTION COMPARISON

==================================================

Where appropriate allow users to compare categories, not just investments:

• Mutual Funds

• ETFs

• Bonds

• FDs

• Insurance

• Loans

• NPS

• Gold

• Tax-saving options

Use MOCK products/providers only.

Show:

Return/benefit

Risk

Liquidity

Tenure

Cost

Suitability

Assumptions

Never promise returns or guaranteed savings.

==================================================

14. WEALTH COACH

==================================================

Reuse existing Wealth Coach.

Make it context-aware.

Opening:

“I’ve analysed your Wealth360. I found 3 areas worth your attention.”

Suggested questions:

• Am I on track for retirement?

• Should I repay my loan or invest?

• How much insurance do I need?

• How is inflation affecting my goals?

• How can I improve my Wealth Health?

Use mock/contextual responses.

Add:

“Educational insight only — not financial advice.”

==================================================

15. RM EXPERIENCE

==================================================

Reuse existing RMModal.

For HNI/UHNI:

• Personalised wealth management

• Request callback

• Schedule meeting

• RM details

Keep AI + Human relationship together.

==================================================

16. DATA PRIVACY + TRUST

==================================================

During onboarding prominently show:

“You are in control of your financial information.”

Include:

• What data is collected

• Why it is used

• Consent

• View shared information

• Remove/edit information

• Consent history

• No transaction without user approval

Future architecture placeholder:

“Connect via Account Aggregator”

but DO NOT implement live AA.

Do not make unsupported security/compliance claims.

==================================================

17. UX / DESIGN

==================================================

KEEP CURRENT m.Stock THEME.

Use:

• m.Stock orange

• Dark navy

• White/light grey

• Clean typography

• Professional financial UI

• Subtle borders/shadows

• Responsive desktop/tablet/mobile

Avoid:

• Purple

• Neon

• Crypto aesthetics

• Excessive gradients

• Excessive rounded cards

• Clutter

Prioritise whitespace, hierarchy and easy scanning.

Make the dashboard feel premium but simple.

Use charts only where they improve understanding.

Prefer modals/drawers for Tax, Debt, Rebalancing, Nomination and simulations rather than unnecessary pages.

==================================================

18. MOCK DATA INTERACTION

==================================================

Everything should feel connected.

Example:

Completing nomination:

6/7 → 7/7

Transfer score increases

Wealth Health updates

Priority action disappears

Increasing SIP:

Goal projection improves

Retirement gap reduces

Dashboard updates

Repaying debt:

Liability decreases

Interest saving updates

Net worth changes

Changing risk profile:

Portfolio suitability/rebalancing changes

Changing age/life event:

Recommendations change.

==================================================

FINAL NAVIGATION

==================================================

Wealth360

• Overview

• Know

• Grow

• Protect

• Plan

• Transfer

• Wealth Coach

Keep Tax, Debt, Rebalancing, Inflation, Nomination, Will etc. inside their parent sections or as drawers/modals.

==================================================

CRITICAL

==================================================

This is a 24-hour hackathon prototype.

Prioritise:

1. Beautiful end-to-end journey

2. Excellent dashboard

3. Strong storytelling

4. Working mock interactions

5. Clear financial insights

6. Trust/privacy experience

7. Unique Wealth360 differentiators

Do not waste credits rebuilding existing components or adding backend/API infrastructure.

The final experience should communicate:

“Don’t just manage your investments.

Manage your entire financial life.”

KNOW → GROW → PROTECT → PLAN → TRANSFER

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/257a8711-c9e2-488e-9b35-25ea1df9dcde).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
