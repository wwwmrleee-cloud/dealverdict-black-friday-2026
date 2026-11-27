// Verdict rules: how DealVerdict decides whether a deal is really a deal.
// Every verdict is computed from the two prices alone, so the badge on a
// card can never disagree with the numbers beside it. The per-deal note in
// deals.js carries the human evidence (tracker low, official sale, and so on).

export const VERDICTS = {
  "all-time-low": { label: "All-time low", rank: 5, cls: "v-low" },
  "first-cut": { label: "First-ever cut", rank: 4, cls: "v-first" },
  strong: { label: "Strong deal", rank: 3, cls: "v-strong" },
  good: { label: "Good deal", rank: 2, cls: "v-good" },
  routine: { label: "Routine sale", rank: 1, cls: "v-routine" },
};

export function discountPct(deal) {
  if (!deal.was || deal.was <= 0) return 0;
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function savedUsd(deal) {
  return Math.max(0, +(deal.was - deal.price).toFixed(2));
}

export function verdictOf(deal) {
  return VERDICTS[deal.verdict] ?? VERDICTS.routine;
}

export function verdictLabel(deal) {
  return verdictOf(deal).label;
}

export function verdictRank(deal) {
  return verdictOf(deal).rank;
}

export function money(n) {
  return "$" + n.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

export function shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", timeZone: "UTC", timeZoneName: "short",
  });
}
