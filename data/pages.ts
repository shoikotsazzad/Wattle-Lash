// Per-page SEO and short page copy. Keys match routes in lib/seo.ts.

export const pages = {
  home: {
    path: "/",
    title: "Wattle & Lash | Lashes, Brows & Eye Beauty Online Australia",
    description: "Shop strip lashes, clusters, lash serums, glues, mascaras and brow products online. Prices include GST. Free standard shipping over $100 Australia-wide.",
  },
  shop: {
    path: "/shop",
    title: "Shop All Lash, Brow & Eye Products",
    description: "Browse strip lashes, clusters, extension kits, serums, adhesives, mascaras, brow products, tools and gift sets. Free shipping over $100.",
  },
  bestsellers: {
    path: "/bestsellers",
    title: "Bestsellers",
    description: "Our most popular lashes, serums, glues and tools. Prices include GST, free shipping over $100 Australia-wide.",
  },
  about: {
    path: "/about",
    title: "About Us",
    description: "Wattle & Lash is an Australian online store for lash, brow and eye beauty, from everyday strip lashes to pro extension kits.",
    eyebrow: "About",
    heading: "Lash, brow and eye beauty, shipping across Australia.",
    intro: "Whether it's your first pair of strips or your salon restock, it's all in one place.",
    highlights: [
      { title: "15 categories", text: "Strip lashes and clusters, kits, serums, glues, mascaras, brow products, eye care, tools, gift sets and beauty supplements." },
      { title: "Simple pricing", text: "Every price includes GST, and standard shipping is free over $100." },
      { title: "Vegan options", text: "Many of our products are vegan. Look for the vegan tag." },
    ],
    imageAlt: "Close-up portrait with soft natural lashes",
    image: "/images/stock/about-eye.webp",
  },
  contact: {
    path: "/contact",
    title: "Contact",
    description: "Questions about an order or product? Call, email or message Wattle & Lash.",
    heading: "Contact us",
    intro: "Questions about a product or an order? Send us a message and we'll reply by email.",
  },
  cart: { path: "/cart", title: "Your Cart", description: "Review your cart." },
  checkout: { path: "/checkout", title: "Checkout", description: "Secure checkout." },
  trackOrder: { path: "/track-order", title: "Track Your Order", description: "Check the status of your Wattle & Lash order." },
  search: { path: "/search", title: "Search", description: "Search lashes, brows and eye products." },
  shipping: { path: "/shipping", title: "Shipping", description: "Shipping costs and delivery across Australia." },
  returns: { path: "/returns", title: "Returns & Refunds", description: "Our returns and refunds policy." },
  privacy: { path: "/privacy", title: "Privacy Policy", description: "How we handle your personal information." },
  terms: { path: "/terms", title: "Terms & Conditions", description: "Terms for shopping with Wattle & Lash." },
  faq: { path: "/faq", title: "FAQ", description: "Answers about shipping, payment, GST, vegan products and patch testing." },
} as const;

export type PageKey = keyof typeof pages;

/** Pages listed in the sitemap (cart, checkout and search are excluded). */
export const sitemapPages: PageKey[] = ["home", "shop", "bestsellers", "about", "contact", "trackOrder", "shipping", "returns", "privacy", "terms", "faq"];
