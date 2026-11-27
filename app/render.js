// Rendering: turns deals into HTML. One function per view — the board's
// stat strip, the deal grid, one deal card, the deal detail page, and the
// empty state. Every price, discount and verdict on a card comes from the
// deal's own numbers, so a card can never show a price the data does not hold.

import { discountPct, money, savedUsd, shortDate, verdictLabel, verdictOf } from "./verdict.js";

function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function statStrip(deals) {
  const totalSaved = deals.reduce((sum, d) => sum + savedUsd(d), 0);
  const lows = deals.filter((d) => d.verdict === "all-time-low").length;
  const avg = Math.round(deals.reduce((sum, d) => sum + discountPct(d), 0) / deals.length);
  const stores = new Set(deals.map((d) => d.store)).size;
  return `
    <div class="stat"><strong>${deals.length}</strong><span>checked deals</span></div>
    <div class="stat"><strong>${lows}</strong><span>all-time lows</span></div>
    <div class="stat"><strong>${avg}%</strong><span>average discount</span></div>
    <div class="stat"><strong>${money(totalSaved)}</strong><span>total savings on this board</span></div>
    <div class="stat"><strong>${stores}</strong><span>stores compared</span></div>`;
}

export function dealCard(deal) {
  const pct = discountPct(deal);
  const v = verdictOf(deal);
  return `
  <article class="card" data-id="${esc(deal.id)}">
    <div class="card-top">
      <span class="store">${esc(deal.store)}</span>
      <span class="cat">${esc(deal.category)}</span>
      <span class="verdict ${v.cls}">${esc(v.label)}</span>
    </div>
    <h3><a href="#/deal/${esc(deal.id)}">${esc(deal.title)}</a></h3>
    <p class="blurb">${esc(deal.blurb)}</p>
    <div class="prices">
      <span class="sale">${money(deal.price)}</span>
      <span class="was">${money(deal.was)}</span>
      <span class="pct">−${pct}%</span>
    </div>
    <p class="save">You save ${money(savedUsd(deal))}</p>
    <p class="note">${esc(deal.note)}</p>
    <p class="checked">Checked ${shortDate(deal.checked)} · Source: ${esc(deal.source)}</p>
    <a class="cta" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} →</a>
  </article>`;
}

export function dealGrid(deals) {
  if (!deals.length) {
    return `<div class="empty">
      <h2>No deals match those filters</h2>
      <p>Try a different search, a lower minimum discount, or clear the filters.</p>
      <button type="button" id="clear-filters">Clear all filters</button>
    </div>`;
  }
  return `<div class="grid">${deals.map(dealCard).join("")}</div>`;
}

export function dealDetail(deal, siblings) {
  const pct = discountPct(deal);
  const v = verdictOf(deal);
  const others = siblings.filter((d) => d.id !== deal.id).slice(0, 3);
  return `
  <div class="detail">
    <p class="back"><a href="#/">← Back to all deals</a></p>
    <div class="detail-head">
      <div>
        <span class="store">${esc(deal.store)}</span>
        <span class="cat">${esc(deal.category)}</span>
        <span class="verdict ${v.cls}">${esc(v.label)}</span>
        <h2>${esc(deal.title)}</h2>
        <p class="blurb">${esc(deal.blurb)}</p>
      </div>
      <div class="detail-prices">
        <span class="sale big">${money(deal.price)}</span>
        <span class="was big">${money(deal.was)}</span>
        <span class="pct big">−${pct}%</span>
        <p class="save">You save ${money(savedUsd(deal))}</p>
      </div>
    </div>
    <section class="verdict-box">
      <h3>Is it really a deal? ${esc(verdictLabel(deal))}</h3>
      <p>${esc(deal.note)}</p>
      <p class="method">Verdicts are earned from the numbers: an all-time low is the lowest price any
      tracker has seen; a strong deal is a deep cut of 25% or more (or $100+ saved); a
      good deal is a real cut worth taking; a first-ever cut is the first discount on a
      product that never goes on sale. A routine sale is a small cut on an inflated list price.</p>
    </section>
    <section class="proof">
      <h3>How this price was checked</h3>
      <ul>
        <li><strong>Checked:</strong> ${shortDate(deal.checked)}</li>
        <li><strong>Source:</strong> ${esc(deal.source)}</li>
        <li><strong>Store:</strong> ${esc(deal.store)} — the link below opens the store's own listing for this product.</li>
        <li><strong>Sale price:</strong> ${money(deal.price)} · <strong>Usual price:</strong> ${money(deal.was)} · <strong>Discount:</strong> ${pct}%</li>
      </ul>
      <a class="cta big" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} →</a>
      <p class="fine">Prices change fast during Black Friday — confirm the price at checkout.</p>
    </section>
    ${others.length ? `<section class="more"><h3>More in ${esc(deal.category)}</h3><div class="grid">${others.map(dealCard).join("")}</div></section>` : ""}
  </div>`;
}
