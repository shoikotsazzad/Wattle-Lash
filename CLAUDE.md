# Wattle & Lash — Website

## Skills
- Process: `sme-core`
- Industry: `sme-ecommerce` (Australian market — see overrides below)
On "continue" or any build request: follow sme-core workflow from step 1.
Next.js version rules: @AGENTS.md

## Market overrides (this project is Australian, not Bangladeshi)
sme-core and sme-ecommerce assume Bangladesh. For this project use instead:
- Currency AUD (`$`, `en-AU` formatting), prices **include GST**. Show "incl. GST" at checkout and on invoices.
- Address: street, suburb, state (NSW, VIC, QLD, WA, SA, TAS, ACT, NT), 4-digit postcode. Phone: Australian format (`04xx xxx xxx` mobile, `0x xxxx xxxx` landline).
- Shipping: free standard shipping over $100 AUD (from brand data); other rates to be decided in the plan.
- Payments: **demo gateway only** (portfolio project, decided 2026-11-01). Card form + Afterpay tab, no real charge, no gateway keys. Test card 4242…, a card ending 0002 is declined. No COD, bKash, Nagad or SSLCommerz.
- No WhatsApp buttons unless the developer asks; contact = phone, email, form, Instagram.
- Cosmetic copy only: no therapeutic or medical claims (e.g. "grows lashes", "treats") — Australian rules (TGA/ACCC). Keep the supplied wording ("helps lashes look fuller").

## Client
- Name: Wattle & Lash (portfolio demo — fictional brand)
- Industry: ecommerce (lash, brow and eye beauty)
- Phone: (03) 7010 4321 · Mobile: 0491 570 156 · Email: hello@wattleandlash.example (all fictional, see notes/client.md)
- Address: Shop 1, 00 Example Lane, Fitzroy VIC 3065, Australia (placeholder)
- Language: English (Australian spelling)
- Full details: `notes/client.md` · Missing items: `notes/missing.md`

## Pages
Home `/` · Shop `/shop` (+ `/shop/[category]`) · Product `/product/[slug]` · Bestsellers `/bestsellers` · About `/about` · Contact `/contact`
Header icons (desktop): search, account, cart (with count). Phones and tablets: fixed bottom bar with Home, Shop, Search, Bag, Account. Extra routes: `/cart`, `/checkout`, `/order/[orderNo]`, `/track-order`, `/account/*`, `/admin/*`.
Footer: Shipping, Returns & Refunds, Privacy, Terms, FAQ.

## Design
Reference: "Velora Beauty" home page (sent in chat 2026-10-30; save as `notes/design/reference-velora-beauty-home.jpg`). Layout and style only. Use none of its brand name, copy or photos.
- Colors (approximate, check against the image): page bg blush `#F1E3E1` · surface `#F8EFED` · text espresso `#2A1E1E` · muted `#7A6466` · dark bands `#2B1E1E` (hero, story band, announcement bar black `#111`) · accent pink `#EBB3BE` (buttons, cart badge, underline swash) / hover `#E29DAB` · product tile bg dusty rose `#E8C7CB` · deep mauve `#B87F8B` for image overlays. Text on dark: cream `#F6EEEA`.
- Fonts: high-contrast light serif, mostly **uppercase**, for headings and the wordmark (Cormorant Garamond 400–500 or Bodoni Moda); sentence-case serif for the big section titles (e.g. "Loved by…"). Small sans with wide tracking (Jost or Montserrat 400–500, 11–13px, uppercase, `tracking-[0.2em]`) for nav, eyebrows, buttons and labels; body 15–16px. h1 ~64px desktop / 38px mobile.
- Spacing: full-width sections, content `max-w-6xl`, sections `py-16 md:py-20`, product grid gap 16–20px.
- Shape: **square corners** (no radius) on buttons, cards and images; flat, no shadows. Buttons: solid pink with dark tracked uppercase text + arrow. Text links: uppercase tracked with underline + arrow.
- Layout:
  - Black announcement bar ("Free shipping on orders over $100").
  - Header sits over the dark hero: nav links left (Shop, Collections, About, Contact), centred serif wordmark with a small tracked sub-line, icons right (search, account, cart with pink count badge), desktop only.
  - Hero: full-bleed dark, warm close-up beauty photo. Text left: eyebrow, 2-line uppercase serif h1, one line of subtext, pink button. Product bottle on the right side of the photo.
  - "Explore our collections": centred tracked eyebrow, then 4 equal image cards with an uppercase serif title and "Shop now →" over the image.
  - Bestsellers: split layout. Left: eyebrow, serif h2, a small hand-drawn heart, "View all products →". Right: 4 product cards (rose-tinted photo, name, price). No wishlist anywhere (removed 2026-11-02).
  - Story band: dark, eye close-up photo on the left, uppercase serif headline, text and pink button. Two tilted "polaroid" photos with tape, plus a sparkle accent.
  - "Lash styles for every you": text left with a pink brush underline. Right: 3 eye photos labelled NATURAL / DOLL EYE / WISPY with a sub-line each, linking to matching strip lashes (WL-STR-001, -003, -007).
  - Decorative hearts and sparkles are hand-drawn and used sparingly (max one per section).
- Copy: don't reuse the reference's unverifiable claims ("Loved by thousands"). Use honest lines such as "Our bestsellers".

## Status
- Stage: new
- Stage: built (2026-10-30). Plan approved: `notes/plan.md`
- Done: all public pages (home with 6 reference sections plus 3 new ones), shop/category/product/search, cart, checkout with demo payment (card + Afterpay, `/api/payments/demo`, Stripe removed), order confirmation, track order, customer accounts, policy pages and FAQ, SEO (sitemap, JSON-LD). Backend: MongoDB with Next route handlers. Admin portal `/admin`: dashboard, orders with CSV, products with Cloudinary photos, categories, discount codes, customers, messages, subscribers, admin users. `npm run seed` imports 15 categories and 225 products plus the first admin.
- Tested: build and lint clean; full API flow against a local MongoDB (pricing, coupons, mark paid with stock deducted once, tracking, CSV). Demo payment tested 2026-11-01 against a local MongoDB: decline, retry, double pay blocked, stock deducted once; browser flow checkout → paid confirmation.
- Pending: `.env.local` filled (Atlas db `wattle_and_lash`, Cloudinary); developer to run `npm run seed`. Old Stripe lines in `.env.local` are unused and can be deleted. Next.js 16.4.0 has a critical advisory, upgrade to 16.4.3 awaiting approval.
- Placeholders open (3): dispatch times (shipping page), returns policy body, analytics line (privacy). Contact/ABN/socials fictional by design. Stock photos are Pexels stand-ins (`notes/assets/photo-credits.md`).
- Redesign 2026-11-02: compact footer (centred below lg), bottom bar below lg with no top menu button (About and Contact are in the footer), shop left sidebar (filter sheet below lg), minimal About and Contact, narrow container on cart/checkout/account/order, one stand-in photo per product (`scripts/product-images.py`, no re-seed needed), no photo repeated on home.
- Dev note: `next dev` dropped hand-written classes added to `app/globals.css` later on, while `next build` kept them. Use Tailwind utilities for new styles.
- Design note: muted text is `#6F5A5C` (darker than `#7A6466`) for 4.5:1 contrast on blush.

## Rules
- Only edit files in this folder.
- Do not copy content from other clients.
- Never invent phone numbers, addresses, prices or reviews. No customer reviews or ratings unless supplied.
- Do not run git commit, git init or git add; the developer handles git.
