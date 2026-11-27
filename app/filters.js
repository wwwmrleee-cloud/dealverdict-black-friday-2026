// Filter and sort rules for the deal board. Pure functions over the deal
// list: given the current filter state they return the deals to show, in
// order. No DOM here, so the same rules can be tested without a browser.

import { discountPct, savedUsd, verdictRank } from "./verdict.js";

export const SORTS = {
  verdict: "Best verdict first",
  discount: "Biggest % off first",
  saved: "Most dollars saved first",
  priceAsc: "Lowest price first",
  priceDesc: "Highest price first",
};

export function allCategories(deals) {
  return [...new Set(deals.map((d) => d.category))];
}

export function allStores(deals) {
  return [...new Set(deals.map((d) => d.store))];
}

export function applyFilters(deals, state) {
  const q = (state.q || "").trim().toLowerCase();
  let out = deals.filter((d) => {
    if (state.category && state.category !== "All" && d.category !== state.category) return false;
    if (state.store && state.store !== "All" && d.store !== state.store) return false;
    if (state.verdict && state.verdict !== "All" && d.verdict !== state.verdict) return false;
    if (state.minDiscount && discountPct(d) < Number(state.minDiscount)) return false;
    if (q) {
      const hay = `${d.title} ${d.store} ${d.category} ${d.blurb}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const by = {
    verdict: (a, b) => verdictRank(b) - verdictRank(a) || discountPct(b) - discountPct(a),
    discount: (a, b) => discountPct(b) - discountPct(a) || savedUsd(b) - savedUsd(a),
    saved: (a, b) => savedUsd(b) - savedUsd(a) || discountPct(b) - discountPct(a),
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
  }[state.sort || "verdict"];
  return [...out].sort(by);
}
