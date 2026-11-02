# Wattle & Lash

**Lash, brow and eye beauty, shipped Australia-wide.**

Wattle & Lash is an online beauty store for Australian shoppers, covering everything for lashes, brows and eyes in one place, from a first pair of strip lashes to a salon restock. The catalogue has 225 products across 15 categories, including strip lashes, clusters, extension and lift kits, serums, glues, mascaras, brow products, eye care, tools, gift sets and beauty supplements.

This repository contains the full store: the customer-facing shop, the backend and an admin portal for running the business day to day.

> **Portfolio project.** Wattle & Lash is a fictional brand. Its contact details are made up, the products are sample data, and checkout uses a simulated payment step, so no real money is taken and card details are never stored.

## What the store does

### For shoppers
- Browse by category, search, sort, and filter by price, vegan or in-stock items
- Add products to the cart, apply discount codes and track progress towards free shipping
- Check out as a guest or with an account, using Australian address and phone formats
- See prices in AUD including GST, with the GST amount shown at checkout and on every order
- Get standard shipping at $9.95, free over $100
- Track orders, view order history and save delivery addresses
- Use it comfortably on any device, with an app-style bottom navigation bar on phones and tablets

### For the store team
- Dashboard with store stats
- Order management, including status updates, tracking numbers and CSV export
- Products, categories and discount codes
- Product photo uploads
- Customers, contact messages and newsletter subscribers
- Role-based admin accounts

## Built with

- **Next.js 16**, React 19 and TypeScript
- **Tailwind CSS 4**
- **MongoDB** with Mongoose
- **Cloudinary** for product photo uploads

Prices and totals are always calculated on the server, and stock is only deducted once per order.

## Run it locally

You need Node.js 20 or newer and a MongoDB database.

```bash
npm install
cp .env.example .env.local   # then add your own values
npm run seed                 # loads the sample catalogue and creates your admin account
npm run dev
```

The store then runs at <http://localhost:3000>.

## Try the checkout

Add a product to the cart, go through checkout and use one of these on the payment step:

| Option | Result |
|---|---|
| Test card `4242 4242 4242 4242`, any future expiry and any CVC | Payment succeeds |
| Test card `4000 0000 0000 0002`, any future expiry and any CVC | Card is declined, and you can retry |
| Afterpay tab | Approved straight away |

These are not real cards, and nothing is charged.

## Project structure

```text
app/          Store pages, admin pages and API routes
components/   UI components
data/         Editable site content, such as page copy, shipping and policies
lib/          Catalogue, pricing, order and validation logic
models/       Database models
public/       Images and static files
scripts/      Database seed and image tools
```

## Photos

Images are free stock photos from [Pexels](https://www.pexels.com), used as stand-ins, so they show the product category rather than the exact product.
