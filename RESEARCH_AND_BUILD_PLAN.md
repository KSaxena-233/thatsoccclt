# Thats OC Charlotte (@thatsoccclt) — E-Commerce Research, Design System & Build Plan

**Prepared for:** ke$h
**Subject:** A one-of-a-kind Shopify storefront for a Charlotte-based sneaker + streetwear resale business
**Business model (observed):** Individual-pair live inventory + hype drops · IG-native (~4.3k followers) · local Plaza/Charlotte meetups + fast shipping · deposits/consignment-style sales · notable clientele (e.g. DaBaby cop)

> **Evidence note.** The 24-source research sweep extracted 109 claims; the automated adversarial verifier was rate-limited mid-run, so nothing got an auto-"confirmed" stamp. Every claim below is **sourced** and additionally **cross-checked against first-principles knowledge (cutoff Jan 2026)**. Confidence is tagged per claim: `[HIGH]` = corroborated by my own knowledge + a primary source; `[MED]` = single source, plausible, verify before spending; `[CHECK]` = verify the exact number/price before relying on it.

---

## PART 0 — The one thing that matters most

In sneaker resale, **the product is a commodity; trust is the moat.** The same Travis 1 exists on StockX, GOAT, eBay, and ten IG plugs. Why does a buyer pay *you*? Two reasons only:

1. **They believe it's real** (authentication / legit-check trust).
2. **They believe you're the source of heat** (curation + social proof + local king energy).

Every design and AI decision in this doc is downstream of those two. thatsoccclt already has both in the real world (meetups, DaBaby cosign, "leading destination for global heat"). The site's entire job is to **make that legible online** — most resale sites fail because they look like a generic Shopify catalog and throw away the founder's IRL trust equity. That's the wedge.

---

## PART 1 — How the best-in-class resale storefronts actually convert

### 1.1 The two structural models (this determines your whole UX)
`[HIGH]` *(extrabux teardown + first-principles)*
- **Marketplace model** — StockX: open bid/ask, price discovery, you never "own" the look, it's a stock-ticker UX. Cold, efficient, zero brand.
- **Consignment / curated-inventory model** — Stadium Goods, Flight Club, Kith, Aimé Leon Dore (ALD): they authenticate *before* taking inventory, then merchandise it like a boutique. Warm, editorial, brand-forward.

**thatsoccclt is the second kind** — a curated boutique with individual pairs. So your reference set is **Kith / ALD / Stadium Goods / Bodega**, NOT StockX. Do not copy the ticker UX; copy the boutique-editorial UX.

### 1.2 Authentication is the category's #1 trust differentiator
`[HIGH]`
- StockX legit-checks physically (weight/density tooling) at its facilities; **GOAT uses ML + in-hand verification** with a massive logged-sneaker dataset; Stadium Goods physically inspects + demands proof of purchase.
- **Takeaway:** a visible, *specific* authentication story converts. Not a vague "100% authentic" badge — a **named process** ("every pair inspected in-hand in Charlotte before it ships; legit-check photos on request"). Specificity = belief.

### 1.3 Conversion benchmarks (set expectations correctly)
`[MED/CHECK]` *(dtcpages 2026 benchmarks — verify exact figures)*
- Fashion / footwear / accessories DTC converts ~**1%–1.5%**, *below* the cross-vertical median — sizing uncertainty + high AOV + tactile product.
- **Mobile ≈ 2.87% vs desktop ≈ 4.51%**, despite mobile being **~84% of traffic.** Your IG audience is even more mobile-skewed (call it 90%+).
- **Implication:** you're optimizing a structurally lower-converting, mobile-dominant funnel. The win isn't a fancy desktop hero — it's **ruthless mobile PDP + checkout speed + trust density.** Every gram of friction on mobile is amplified.

### 1.4 What the boutique players do on the page that converts
`[HIGH]` *(Kith brand breakdown + section.store trust-badge piece + first-principles)*
- **Editorial homepage, not a catalog dump.** Kith/ALD lead with lookbook-grade imagery and *story*, then funnel to product. The grid is a destination you *arrive at*, not the front door.
- **Drops as appointment viewing.** Countdown timers, "this Friday," limited entries. Scarcity is merchandised, not hidden.
- **Trust badges that aren't tacky:** real shipping promises, real return/auth policy, real payment logos — placed *near the buy button* where doubt peaks. Generic "trust seal" badges actually *reduce* trust with savvy buyers; specific guarantees raise it.
- **One-of-one PDP pattern:** since each pair is unique, the PDP must show **the actual pair** (your photos, that pair's condition, that pair's size) — not a stock catalog render. This is the single biggest UX difference between a reseller and a brand, and most reseller Shopify sites get it wrong by reusing stock images.

---

## PART 2 — The Shopify build: two tiers, decided with numbers

You asked me to research both and recommend. Here's both, then the call.

### 2.1 Tier A — Headless (Hydrogen + Oxygen, React/Remix)
`[HIGH]` *(Shopify enterprise blog + vervaunt + askphill)*
- **What it is:** custom React/Remix storefront, Shopify only as the commerce backend/API. Total design + AI freedom.
- **Cost:** ranges from **thousands to millions** upfront + ongoing maintenance; Shopify itself positions headless for merchants with **$1M+ build budgets, 6+ month timelines, $50–100M+ online revenue.**
- **Pros:** unlimited design ceiling, fastest possible perf if done right, AI/UX with no theme constraints.
- **Cons:** you maintain a codebase forever; every app that "just works" in a theme now needs custom integration; SEO/checkout/analytics all become your problem; slow to ship.

### 2.2 Tier B — Premium theme, heavily customized + apps
`[HIGH]` *(ecomposer streetwear-theme roundup + first-principles)*
- **What it is:** start from a strong commercial theme — **Shrine (purpose-built for hype/drops + conversion), Pipeline, Impulse, or a custom Dawn fork** — then push it hard with custom Liquid sections, a real design system, and a tight app stack.
- **Cost:** theme $0–$400 one-time + design/dev. A genuinely custom, one-of-a-kind result lands in the **low-mid four figures to ~$15k** depending on how much bespoke section work and motion you commission.
- **Pros:** ship in weeks not quarters; entire app ecosystem works out of the box; Shopify maintains the hard parts (checkout, PCI, perf baseline); SEO handled.
- **Cons:** design ceiling is high but not infinite; you'll fight the theme on truly exotic interactions.

### 2.3 The call for thatsoccclt → **Tier B now, architected to graduate to headless later**

At ~4.3k followers and pre-scale revenue, **headless is a vanity spend** — you'd burn 6 months and 5 figures buying a design ceiling you can't yet fill and a maintenance burden you don't want. The boutiques you'd emulate (early Kith, most ALD-tier shops) ran on themed Shopify for years.

> **Recommendation: build on Shrine (or a custom Dawn fork) with a bespoke design system + custom hero/PDP/drop sections.** You get 90% of the "one-of-a-kind" ceiling at ~15% of the cost/time. **Keep content in Shopify metafields + a clean section architecture** so that *if* you blow up, the migration to Hydrogen is a re-skin, not a rebuild. Decision rule to revisit headless: **>$1M/yr online revenue OR a custom interaction the theme genuinely can't do that's proven to move conversion.** Not before.

### 2.4 The resale app stack (this is where the real research value is)
All `[MED]` unless noted — these are real apps; **verify current pricing/feature parity before installing**, app terms move fast.

| Need | App | What it does | Note |
|---|---|---|---|
| **Drops / raffles** | **EQL: Launches & Drops** | Three drop mechanics: random draw/raffle, exclusive access, exclusive FCFS; built-in bot mitigation + entry rules. Free install, **~1–4% per-launch transaction fee** (can pass to customer). | The hype-release engine. `[CHECK]` fee tiers |
| **Drops (alt)** | **SuperSwipe** | Native product-drop system, AI bot detection blocking fake entries, **deferred billing** (charge only winners). Free to install. | Lighter-weight raffle option |
| **One-of-one inventory + cross-listing** | **Copyt** | Cross-lists each physical pair to eBay, StockX, Whatnot, Alias, Square, Clover, and **auto-delists everywhere when it sells on one channel.** Solves the single-pair double-sell problem. | **This is critical for you** — you sell the same pair on IG + meetups + site. `[MED]` |
| **Consignment** | **Copyt** (consignor portal) or **ReSelly** (Shopify Plus) | Consignor portal, consigned-item tracking, automated payouts, vendor contracts/intake. | ReSelly is Plus-only `[CHECK]` |
| **Bot/queue protection during drops** | EQL / SuperSwipe (built-in) + Shopify's native bot protection / Shop Pay | Throttle + verify during launches. | Don't bolt on a separate bot-mgmt tool until volume demands |
| **Deposits / pre-orders** | A deposit/partial-payment app (e.g. Downpayment-class) | Matches your IRL "deposit to hold" flow. | Map your real meetup-deposit behavior to it |
| **Reviews / social proof** | Loox or Judge.me (photo reviews) | Photo reviews = trust in resale. | Photo-first, not text |
| **Loyalty** | Smile.io-class | Repeat-buyer flywheel. | Phase 2 |
| **IG / social commerce** | Shopify's native IG/Facebook channel + tagged shopping | Your acquisition is 100% IG — close the loop so IG → product is one tap. | Day-one must-have |

**Platform primitives to turn on:** Shop Pay (single biggest mobile checkout-conversion lever — accelerated checkout for a mobile-90% audience), Shopify Markets (only if you ship internationally — "global heat" implies maybe), checkout extensibility for custom trust messaging at the buy step.

---

## PART 3 — AI integration roadmap (4 layers, ROI-sequenced, real tools)

You greenlit all four. Here they are ordered by **ROI ÷ effort** — build top-down.

### Layer 1 (build first) — AI Ops automation: IG/photo → live listing
`[MED]` · highest leverage, lowest customer-facing risk
- **The pain:** you're manually cataloging pairs. Every hour spent listing is an hour not sourcing/selling.
- **The build:** a **Claude API (vision) pipeline** — snap a pair (or pull from your IG), Claude identifies model/colorway/SKU, drafts the title + description in your brand voice, suggests size/condition fields, and pushes a draft product to Shopify via Admin API. Human approves in one tap.
- **Tools:** Claude API (vision + structured output) for the identify-and-write step; Shopify Admin API for product creation; **Shopify Magic** (native, free) for first-pass product copy if you want zero-build; **KicksDB** `[CHECK ~€79/mo]` to auto-attach the correct SKU/market data.
- **Why first:** pure internal tool, no customer sees it, saves hours weekly, and it's the **data foundation** every other AI layer reads from.

### Layer 2 — AI pricing + drop intelligence
`[MED]` · directly makes/saves money
- **KicksDB Real-time API** `[CHECK]`: live pricing from StockX/GOAT + others, claimed 99.5% request success, **from ~€79/mo**; plus a **Shopify Manager that auto-syncs + reprices on a ~15-min cadence at ~€0.05/product.** This is the concrete pricing-automation path.
- **The build:** pull comps → show your price *against* the StockX/GOAT median on the PDP ("our price vs market") → demand-rank the grid by heat → flag underpriced-vs-market inventory to *you* so you never leave money on the table.
- **Drop prediction:** layer release calendars + your sell-through to forecast which restocks/drops to chase. Phase 2.

### Layer 3 — AI trust + authentication (the conversion unlock)
`[MED]`
- **Don't build a legit-check model — you'd be liable and you'd lose.** Integrate the proven players:
  - **Entrupy** `[CHECK]`: claims **99.86% accuracy**, high-res imaging + ML against millions of records, results fast enough for intake; **MarketEDGE** adds real-time value + **AI condition grading** + API for enterprise. A financial-guarantee-backed authentication is a *sellable trust asset* on your PDP.
  - **CheckCheck** `[CHECK]`: hybrid **AI + dual-human-expert** (two experts must agree to PASS) + **digital Certificate of Authenticity**, with **API/SDK/webhooks + native Shopify integration**, barcode scanning, financial guarantee.
- **The build:** authenticate at intake → attach the **digital COA + legit-check photos to that specific pair's PDP** → badge it. This is the single highest-trust signal you can put next to the buy button, and it's *real*, not theater.
- **Lightweight AI assist (optional):** a Claude-vision "condition pre-grader" on *your* intake photos to draft a condition score + flag obvious red flags — assists you, never replaces the paid authentication for the customer guarantee.

### Layer 4 — Customer-facing AI concierge
`[MED]` · highest visibility, build last (it's only as good as the catalog data from Layers 1–2)
- **Conversational discovery** over live inventory: "find me a clean pair of low Dunks under $200 in size 10," styling pairings, size/fit guidance. Backed by **vector/semantic search** over your catalog (embeddings of each pair) + Claude API for the conversation.
- **The 2026 context you must not miss:** `[MED]` In **Dec 2025 Shopify launched "Agentic Storefronts"** — publish your catalog (via **Shopify Catalog**, a structured product/price/availability/policy feed) into **ChatGPT, Perplexity, and Microsoft Copilot**, where shoppers ask, compare, and **buy in one chat thread**, orders routed through Shopify checkout with merchant attribution preserved.
  - **Strategic read:** AI chat is becoming a *storefront surface*, not just an on-site widget. Getting your catalog structured + clean (Layer 1) is what makes you *present* when someone asks ChatGPT "where can I cop a pink Dunk." **Early-mover edge for a small shop.** Turn this on as soon as it's available to you.

### What's real vs hype (the honest cut)
- **Real & shipping now:** Shopify Magic/Sidekick copy, Claude-vision cataloging, KicksDB pricing, Entrupy/CheckCheck authentication, Agentic Storefronts/Catalog, semantic catalog search.
- **Hype / not worth it yet:** fully-autonomous "AI runs your store," AI legit-check you build yourself (liability trap), AI-generated product imagery for resale (you sell *real specific pairs* — fake renders destroy the exact trust you need).

---

## PART 4 — Design system: the one-of-a-kind aesthetic

The brief: translate the **graffiti "Thats OC CLT" identity (sneakers + cash + Charlotte teal/orange energy)** into a premium-but-street web experience that does **not** read templated or AI-made.

### 4.1 Positioning the aesthetic
The trap most resale sites fall into: either (a) generic dark Shopify theme = looks like everyone, or (b) try to be StockX = cold and brandless. **Your lane is "boutique heat" — Kith's editorial polish wearing streetwear's attitude.** Premium structure, street energy.

### 4.2 Direction: **"Charlotte Concrete"** — editorial-brutalist, dark, heat-forward
Pulled from 2025–2026 award-winning streetwear web design `[MED]` *(envato + fireart trend research, Awwwards ecommerce SOTY)*:
- **Kinetic / variable typography** — animated text that shifts weight + reacts to interaction (variable fonts + CSS). A defining 2026 move (Jitter, Sofi, Museum of Money, AVA SRG cited as exemplars). Use it on the wordmark + drop headlines.
- **Broken grid** — abandon the rigid 12-column for **asymmetric, overlapping, slightly diagonal layouts** to manufacture personality. This is *the* fastest way to not look like a theme. Use it on the homepage + lookbooks, keep the product grid disciplined (commerce needs scannability).
- **Editorial > catalog** — homepage is a *magazine cover*, not a product wall.

### 4.3 Concrete design tokens

**Color — dark base, controlled heat**
```
--ink:        #0B0B0C   /* near-black base, matches your IG */
--graphite:   #16171A   /* card/surface */
--bone:       #F4F1EA   /* off-white text / "cash paper" warmth, NOT pure #fff */
--clt-teal:   #19C2B6   /* the graffiti teal — primary accent, used SPARINGLY */
--heat-orange:#FF5A1F   /* the orange — secondary accent / "FIRE/drop live" state */
--cash-green: #1E7F4F   /* deep money green — micro-accent for price/auth-verified */
```
Rule: **one dominant accent per surface.** Teal *or* orange leads on a given screen, never both fighting. The off-white (`--bone`) over near-black is the premium move — pure white on pure black screams template.

**Typography — the anti-template lever**
- **Display / wordmark:** a characterful grotesque or a condensed heavy face with attitude (e.g. a licensed face in the *Neue Machina / PP Right Grotesk / Druk-condensed* family). This single choice does 60% of the "not-a-theme" work. **Do not use the theme default. Do not use Inter/Poppins/Montserrat** — those are the AI-slop tells.
- **Body:** a clean neutral grotesque for legibility (a well-spaced sans), small and tight.
- **Mono accent:** a monospace for prices, sizes, SKUs, COA #s — reads "verified / technical / authentic," reinforces trust.
- **Variable-font kinetic treatment** on the wordmark + "DROP LIVE" states only. Restraint = premium.

**Motion**
- Page transitions + reveal-on-scroll (subtle, fast — mobile budget is tight).
- A signature micro-interaction: e.g. the wordmark "tags in" (graffiti spray reveal) once on load, then never again. One memorable moment, not motion everywhere.
- **Performance guardrail:** every gram of motion is measured against mobile LCP. If it costs >100ms, it's cut. (Mobile conversion is already structurally low — don't make it worse for polish.)

**Texture**
- Subtle concrete/asphalt grain on dark sections + faint Charlotte map or "CLT/Plaza" geo-mark = local rootedness. Used at 3–5% opacity, never loud.

### 4.4 Page architecture

**Homepage (the magazine cover)**
1. Kinetic wordmark + one heat line ("Leading destination for global heat · Charlotte").
2. **Featured drop / hero pair** — big, editorial, countdown if it's a drop.
3. **Clientele / social-proof strip** — *this is your DaBaby asset.* A horizontal wall of celebrity + notable cops (pull from your IG highlights). **Highest-converting trust signal on the site** — local-king-buys-local-shop beats any badge. Build it as a CMS-driven strip you update from the admin.
4. New arrivals grid (disciplined).
5. **"How it works" trust band** — authenticate-in-Charlotte process, meetup option, fast shipping, deposit-to-hold. Specific promises, mono type, real.
6. IG feed embed (your funnel, closed).

**Product grid (catalog)**
- Disciplined responsive grid, **mobile-first** (2-up on phone).
- Each card: *your actual pair photo*, model, size, condition pill, price, market-vs-our-price flag.
- Filters that matter for resale: size, brand, price, condition, "authenticated ✓," "1 of 1 / last pair."

**PDP (the conversion moment — one-of-one pattern)**
- **The actual pair's photos** (multi-angle, your shots) — never stock renders.
- Size (single, since one pair), condition grade, **digital COA + legit-check photos**, price vs market.
- Buy button with Shop Pay; trust band *adjacent* (auth guarantee, shipping promise, deposit option).
- "Cop in person at a Plaza meetup" option — your IRL differentiator, on the page.
- AI concierge entry point ("ask about fit / styling").

### 4.5 The anti-AI-slop checklist
- ❌ Inter/Poppins/Montserrat · ❌ purple-blue gradients · ❌ generic emoji feature cards · ❌ pure-white-on-pure-black · ❌ stock 3D blobs · ❌ centered everything · ❌ "Lorem-ish" hype copy.
- ✅ a licensed display face with real character · ✅ off-white on near-black · ✅ broken/asymmetric editorial layouts · ✅ *your real photography* of *real pairs* · ✅ mono type for verified data · ✅ one signature motion moment · ✅ local Charlotte texture.

---

## PART 5 — Sequenced build plan

**Phase 0 — Foundation (week 1)**
- Shopify plan, Shrine (or custom Dawn fork) theme, domain, Shop Pay on.
- Brand kit: lock type + color tokens above, get the display font licensed, vectorize the graffiti wordmark for web.
- Connect IG/Facebook channel.

**Phase 1 — Storefront v1 (weeks 2–4)**
- Build the homepage (magazine cover + **clientele/DaBaby strip** + trust band), custom PDP (one-of-one pattern), disciplined grid.
- **Copyt** for cross-listing/one-of-one + consignment.
- Deposit app mapped to your meetup-deposit flow. Loox photo reviews.
- Ship it. Start selling. Cash flow funds the rest.

**Phase 2 — Drops + AI ops (weeks 4–8)**
- **EQL or SuperSwipe** drop engine for hype releases (raffle + countdown merchandising).
- **Layer 1 AI:** Claude-vision IG/photo → draft listing pipeline (your internal time-saver).
- **Layer 2 AI:** KicksDB pricing + "vs market" PDP flag.

**Phase 3 — Trust + concierge (weeks 8–12)**
- **Layer 3:** integrate Entrupy *or* CheckCheck → digital COA on PDPs, authenticated badge.
- **Layer 4:** AI concierge (semantic catalog search + Claude) + publish catalog to **Shopify Agentic Storefronts** (ChatGPT/Perplexity/Copilot) the moment it's available to you.

**Phase 4 — Polish + scale**
- Loyalty, design-review pass (kill AI-slop tells), performance/Core-Web-Vitals tuning, motion signature.
- Revisit headless *only* if the >$1M-revenue / proven-interaction trigger fires.

---

## Sources (24 fetched; pricing/feature claims flagged `[CHECK]` — verify before spend)
- Conversion benchmarks: dtcpages.com/blog/ecommerce-conversion-rate-benchmarks-2026; shopify.com/enterprise/blog/fashion-conversion-rate-optimization
- Resale model + authentication: extrabux.com/en/guide/6845044; nikeshoebot.com/checkcheck-sneaker-authentication
- Trust badges/PDP: section.store (shopify-product-page-trust-badges-2026)
- Headless vs theme: shopify.com/enterprise/blog/headless-commerce-vs-traditional-commerce; vervaunt.com/shopify-hydrogen-oxygen-pros-cons; askphill.com (headless + hydrogen/oxygen); lanternsol.com/blogs/headless-vs-shopify-themes
- Streetwear themes: ecomposer.io/blogs/shopify-themes/best-streetwear-themes
- Drop/resale apps: apps.shopify.com/super-swipe, /eql-launches, /copyt, /reselly
- Pricing API: kicks.dev
- Authentication: entrupy.com/sneaker-authentication; getcheckcheck.com
- AI commerce: pymnts.com (Shopify catalogs → ChatGPT/Perplexity/Copilot, Dec 2025); alhena.ai/blog/conversational-search-ai-product-discovery
- Design trends: elements.envato.com/learn/web-design-trends; fireart.studio/blog/the-best-web-design-trends; awwwards.com/annual-awards-2025/ecommerce-site-of-the-year
- Brand reference: directtoconsumer.co (Kith brand breakdown)
