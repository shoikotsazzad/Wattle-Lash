// Shipping rules (AUD cents, GST included). Only standard shipping is confirmed.

export const shipping = {
  freeThreshold: 10000, // $100.00
  methods: [
    { id: "standard", label: "Standard shipping", eta: "Australia-wide", price: 995 },
  ],
} as const;

export type ShippingMethodId = (typeof shipping.methods)[number]["id"];

export const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;
export type AuState = (typeof AU_STATES)[number];
