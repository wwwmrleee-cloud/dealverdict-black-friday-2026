// Boot and interaction: reads the filter state, renders the board, and
// routes between the board (#/) and one deal's page (#/deal/<id>).
// The board re-renders on every filter change, so what you see is always
// what the current filters select — nothing is ever stale.

import { CHECKED_LABEL, deals } from "./deals.js";
import { SORTS, allCategories, allStores, applyFilters } from "./filters.js";
import { dealDetail, dealGrid, statStrip } from "./render.js";

const state = { q: "", category: "All", store: "All", verdict: "All", minDiscount: "", sort: "verdict" };

const $ = (sel) => document.querySelector(sel);

function option(value, label) {
  return `<option value="${value}">${label}</option>`;
}

function buildControls() {
  const cats = allCategories(deals);
  const stores = allStores(deals);
  $("#category").innerHTML =
    option("All", "All categories") + cats.map((c) => option(c, c)).join("");
  $("#store").innerHTML =
    option("All", "All stores") + stores.map((s) => option(s, s)).join("");
  $("#sort").innerHTML = Object.entries(SORTS)
    .map(([v, l]) => option(v, l)).join("");
}

function renderBoard() {
  const shown = applyFilters(deals, state);
  $("#stats").innerHTML = statStrip(deals);
  $("#count").textContent =
    `${shown.length} of ${deals.length} deals · checked ${CHECKED_LABEL}`;
  $("#results").innerHTML = dealGrid(shown);
  const clear = $("#clear-filters");
  if (clear) clear.addEventListener("click", resetFilters);
}

function resetFilters() {
  Object.assign(state, { q: "", category: "All", store: "All", verdict: "All", minDiscount: "", sort: "verdict" });
  $("#q").value = "";
  $("#category").value = "All";
  $("#store").value = "All";
  $("#verdict").value = "All";
  $("#min-discount").value = "";
  $("#sort").value = "verdict";
  renderBoard();
}

function renderRoute() {
  const hash = location.hash || "#/";
  const match = hash.match(/^#\/deal\/([\w-]+)$/);
  const board = $("#board");
  const intro = $("#board-intro");
  const detail = $("#detail");
  if (match) {
    const deal = deals.find((d) => d.id === match[1]);
    if (deal) {
      board.hidden = true;
      intro.hidden = true;
      detail.hidden = false;
      detail.innerHTML = dealDetail(deal, deals.filter((d) => d.category === deal.category));
      window.scrollTo(0, 0);
      document.title = `${deal.title} — DealVerdict`;
      return;
    }
  }
  detail.hidden = true;
  board.hidden = false;
  intro.hidden = false;
  document.title = "DealVerdict — Real Black Friday deals, checked Nov 27, 2026";
  renderBoard();
}

function bind() {
  $("#q").addEventListener("input", (e) => { state.q = e.target.value; renderBoard(); });
  $("#category").addEventListener("change", (e) => { state.category = e.target.value; renderBoard(); });
  $("#store").addEventListener("change", (e) => { state.store = e.target.value; renderBoard(); });
  $("#verdict").addEventListener("change", (e) => { state.verdict = e.target.value; renderBoard(); });
  $("#min-discount").addEventListener("change", (e) => { state.minDiscount = e.target.value; renderBoard(); });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; renderBoard(); });
  $("#reset").addEventListener("click", resetFilters);
  window.addEventListener("hashchange", renderRoute);
}

function readStateFromUrl() {
  const params = new URLSearchParams(location.search);
  const pick = (name, allowed) => {
    const v = params.get(name);
    return v && (!allowed || allowed.includes(v)) ? v : null;
  };
  state.q = params.get("q") || "";
  state.category = pick("category", ["All", ...allCategories(deals)]) || "All";
  state.store = pick("store", ["All", ...allStores(deals)]) || "All";
  state.verdict = pick("verdict", ["All", "all-time-low", "first-cut", "strong", "good", "routine"]) || "All";
  state.minDiscount = pick("minDiscount", ["20", "30", "40", "50"]) || "";
  state.sort = pick("sort", Object.keys(SORTS)) || "verdict";
  $("#q").value = state.q;
  $("#category").value = state.category;
  $("#store").value = state.store;
  $("#verdict").value = state.verdict;
  $("#min-discount").value = state.minDiscount;
  $("#sort").value = state.sort;
}

buildControls();
readStateFromUrl();
bind();
renderRoute();
