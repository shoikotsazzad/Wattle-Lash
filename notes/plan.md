# Page plan — Wattle & Lash (draft, awaiting approval)

Stack: Next.js 16 App Router + Tailwind 4. Backend = Next.js route handlers + MongoDB (Mongoose). No separate Express server.
Design: `notes/design/reference-velora-beauty-home.jpg` → tokens in CLAUDE.md `## Design`.

## Navbar (over dark hero on Home, solid espresso elsewhere)
Left: Shop · Collections (mega-menu of 15 categories) · About · Contact
Centre: WATTLE & LASH wordmark + "LASH · BROW · EYE" sub-line
Right: search · account · wishlist · cart (pink count badge)
Top: black announcement bar "Free shipping on orders over $100"

## Public pages
| Route | Sections |
|---|---|
| `/` | see Home below |
| `/shop`, `/shop/[category]` | Title band · category chips · filters (price, vegan, in stock) · sort · grid (4/2 cols) · load more |
| `/product/[slug]` | Gallery · name, price incl. GST, size, vegan badge · qty · Add to cart / Buy now · wishlist · shipping + returns snippet · description · "How to use" (if supplied) · related products |
| `/bestsellers` | Grid of products flagged bestseller |
| `/search?q=` | Results grid |
| `/about` | Story band · values (only supplied facts) · CTA |
| `/contact` | Phone, mobile, email, address (placeholder), contact form → saved to Mongo |
| `/cart`, `/checkout` | Cart lines, free-shipping progress bar · checkout: email, name, AU address (suburb/state/postcode), phone, shipping method, payment |
| `/order/[orderNo]` | Confirmation, payment status, items, totals incl. GST |
| `/track-order` | orderNo + email → status timeline |
| `/account/*` | login, register, orders, order detail, addresses, wishlist |
| Footer pages | `/shipping`, `/returns`, `/privacy`, `/terms`, `/faq` |

## Home (reference sections 1–6 + 3 new ones)
1. Announcement bar + header over hero
2. Hero: dark photo, eyebrow, 2-line uppercase h1, one line of subtext, pink "Shop now →"
3. Explore our collections: 4 image cards (Strip Lashes, Serums, Tools, Brows; editable in data)
4. Our bestsellers: split layout, left text + heart, right 4 product cards from DB (`bestseller: true`)
5. Story band: dark, eye photo, headline, text, "Our story →", 2 taped polaroids + sparkle
6. Lash styles for every you: Natural / Doll Eye / Wispy → WL-STR-001 / -003 / -007
7. **NEW: "Your lash routine in 4 steps"** (Prep → Prime → Apply → Remove). Numbered square cards on surface bg, each linking to its category (primers, adhesives, strip lashes, removers). Educational copy with no claims.
8. **NEW: "New in" plus "Gift sets"**: two product rails with tabs (newest products by created date / gift-sets category), plus a dusty-rose banner tile for gift sets
9. **NEW: Trust strip and "Join the list"**: 4 icons (Free shipping over $100 · Secure checkout · Prices incl. GST · Returns per policy), then a dark newsletter band with email signup → Mongo `Subscriber`
10. Footer: wordmark, shop links, help links (Shipping, Returns, Privacy, Terms, FAQ, Track order), contact, payment icons, © year

## Data
- `data/site.ts`: brand, contact, announcement, nav, footer
- `data/home.ts`: hero, collections, story, lash styles, routine steps, trust items copy
- `data/shipping.ts`: rates and free threshold · `data/legal.ts`: policy texts · `data/faq.ts`
- Catalog in **MongoDB** (admin-managed). `scripts/setup-db.mjs` imports `notes/assets/brand-and-categories.json` + `notes/assets/products.json`.

## Backend (MongoDB): level = orders + admin + customer accounts
Models: `Category`, `Product` (sku, slug, category, name, description, size, price (cents AUD), stock, bestseller, vegan, images[], active), `Order` (orderNo `WL-YYMMDD-XXXX`, customer, AU address, items snapshot, subtotal, shipping, total, gstIncluded, payment {provider "test", status, method}, status `new|processing|shipped|delivered|cancelled`, tracking no., timeline), `User` (customer/admin role, bcrypt hash, addresses, wishlist), `Subscriber`, `Lead`.
API: `/api/products`, `/api/checkout` (server recomputes totals from DB), `/api/payments/test` (marks paid and decrements stock once), `/api/auth/*`, `/api/account/*`, `/api/track`, `/api/newsletter`, `/api/contact`, `/api/admin/*`.
Payments: test-mode gateway (changed 2026-11-01). Card form validated in the browser, only method + last 4 digits sent; card ending 0002 is declined; Afterpay tab approves instantly. No Stripe.

## Admin portal `/admin` (noindex, role-checked in proxy.ts + every handler)
- Dashboard: today/7-day revenue, order count, low-stock list, recent orders
- Orders: filter (status, payment, date), detail, status update, tracking number, CSV export
- Products: list/search, create/edit/delete, stock, bestseller/vegan flags, images
- Categories: edit name/description/image/order
- Customers: list, order history · Subscribers + contact messages: list, CSV
- Admin users: invite/remove (role `admin`)

Remove starter routes `/services`, `/gallery` and the WhatsApp floating button.
