# Missing info

## Setup (developer)
- [ ] Run `npm run seed` (categories, 225 products, first admin)
- [ ] Next.js 16.4.0 → 16.4.3 security upgrade (awaiting approval)

## Content placeholders
- [ ] Dispatch times / delivery estimates — `data/legal.ts` shippingPolicy (Shipping page)
- [ ] Returns & refunds policy text — `data/legal.ts` returnsPolicy (Returns page)
- [ ] Analytics line in Privacy — `data/legal.ts` privacy (remove if no analytics)

## Brand
- [ ] Logo (typographic wordmark used for now)
- [ ] Real product photos (each product shows a stand-in stock photo until one is uploaded in admin)
- [ ] Social URLs — handles are fictional, shown without links (`data/site.ts`)
- [ ] Opening hours (none shown; online store)

## Done
- [x] Full product list — `notes/assets/products.json` (225 products)
- [x] Design reference saved — `notes/design/reference-velora-beauty-home.jpg`
- [x] `.env.local` filled (MongoDB `wattle_and_lash`, auth, admin, Cloudinary)
- [x] Shipping: standard $9.95, free over $100 · Payments: demo gateway (no Stripe) · Admin: role-based accounts · No email service
