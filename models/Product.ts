import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// Prices are integer AUD cents, GST included.
const ProductSchema = new Schema(
  {
    sku: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    size: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0 },
    bestseller: { type: Boolean, default: false },
    vegan: { type: Boolean, default: false },
    images: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type Product = InferSchemaType<typeof ProductSchema>;
export const ProductModel = (models.Product as Model<Product>) || model("Product", ProductSchema);
