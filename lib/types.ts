// Plain, serialisable shapes shared by server and client code.

export type ProductView = {
  id: string;
  sku: string;
  slug: string;
  category: string;
  name: string;
  description: string;
  size: string;
  price: number; // cents
  compareAtPrice?: number;
  stock: number;
  bestseller: boolean;
  vegan: boolean;
  images: string[];
  image: string; // first image or category photo
  createdAt: string;
};

export type CategoryView = {
  slug: string;
  name: string;
  description: string;
  image: string;
  order: number;
  count: number;
};

export type CartLine = { sku: string; qty: number };

export type QuoteLine = {
  sku: string;
  slug: string;
  name: string;
  size: string;
  image: string;
  price: number;
  qty: number;
  lineTotal: number;
  stock: number;
  error?: string;
};

export type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponError?: string;
  shippingFee: number;
  freeShippingRemaining: number;
  total: number;
  gst: number;
  ok: boolean;
};
