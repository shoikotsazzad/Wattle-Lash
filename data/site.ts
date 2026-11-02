// Business details used across the whole site (header, footer, contact, SEO, JSON-LD).
// Contact details are placeholders until the real ones are added (see notes/client.md).

export const site = {
  name: "Wattle & Lash",
  wordmarkSub: "Lash · Brow · Eye",
  tagline: "Lash, brow and eye beauty, shipped Australia-wide.",
  description:
    "Shop strip lashes, lash clusters, serums, adhesives, mascaras, brow products and tools online. Prices include GST. Free standard shipping over $100.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  lang: "en-AU",
  locale: "en_AU",
  logo: "/images/logo.svg",
  ogImage: "/images/og.svg", // replace with a 1200x630 JPG for production

  phone: "+61370104321",
  phoneDisplay: "(03) 7010 4321",
  mobile: "+61491570156",
  mobileDisplay: "0491 570 156",
  email: "hello@wattleandlash.example",
  ordersEmail: "orders@wattleandlash.example",
  abn: "00 000 000 000",

  address: {
    street: "Shop 1, 00 Example Lane",
    suburb: "Fitzroy",
    state: "VIC",
    postcode: "3065",
    country: "AU",
  },

  // Hours not supplied. Online store, so none are shown.
  hoursText: "",

  // Handles only for now. Add a url once each account is live.
  socials: [
    { name: "Instagram", handle: "@wattleandlash", url: "" },
    { name: "TikTok", handle: "@wattleandlash", url: "" },
    { name: "Facebook", handle: "Wattle & Lash", url: "" },
  ],

  announcement: "Free standard shipping on orders over $100",

  nav: [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/shop", mega: true },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],

  footer: {
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Bestsellers", href: "/bestsellers" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Track order", href: "/track-order" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
    payments: ["Card", "Afterpay", "Test mode"],
  },

  schemaType: "OnlineStore",
  currency: "AUD",
};

export type Site = typeof site;
