# DealVerdict — Real Black Friday deals, checked Nov 27, 2026

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/wwwmrleee-cloud/dealverdict-black-friday-2026/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/wwwmrleee-cloud/dealverdict-black-friday-2026/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

46 real Black Friday 2026 deals, each checked at its store on Nov 27, 2026, with an honest verdict on whether it is really a deal — all-time low, strong deal, good deal or first-ever cut — plus the evidence behind the verdict. Search and filter by category, store, verdict and discount; sort by verdict, discount, dollars saved or price; open any deal for its full check record and store link. 8 all-time lows, 46 deals, 10 categories, 6 stores, $7,925 in total savings.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. No build step, no network requests: the site is static files under `app/`, and the deals are data in `app/deals.js`.

## How the verdicts work

- **All-time low** — the lowest price any tracker has seen for that product.
- **First-ever cut** — the first discount on a product that never goes on sale (this year: the Switch 2 bundle, the only console with an official cut).
- **Strong deal** — a deep cut of 25% or more, or $100+ saved.
- **Good deal** — a real cut worth taking.
- **Routine sale** — a small cut on an inflated list price; none is listed here.

Every deal shows its sale price, usual price, discount, dollars saved, the time it was checked and the source that reported the price, with a link to the store's own listing for the product. Prices change by the hour during Black Friday — confirm at checkout.

---

<sub>Entered on [make.fun](https://make.fun/?ref=x0yy8q40&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
