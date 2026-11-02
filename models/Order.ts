import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const ORDER_STATUSES = ["new", "processing", "shipped", "delivered", "cancelled"] as const;
export const PAYMENT_STATUSES = ["unpaid", "pending", "paid", "failed", "refunded"] as const;

const OrderSchema = new Schema(
  {
    orderNo: { type: String, required: true, unique: true },
    // Random key so the confirmation page can't be opened by guessing order numbers.
    accessKey: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },
    address: {
      line1: { type: String, required: true },
      line2: String,
      suburb: { type: String, required: true },
      state: { type: String, required: true },
      postcode: { type: String, required: true },
      country: { type: String, default: "AU" },
    },
    items: [
      {
        _id: false,
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        sku: String,
        slug: String,
        name: String,
        size: String,
        image: String,
        price: Number, // cents, snapshot at order time
        qty: Number,
      },
    ],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    couponCode: String,
    shippingMethod: String,
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    gst: { type: Number, required: true }, // GST component included in total (total / 11)
    note: String,
    payment: {
      provider: { type: String, default: "test" },
      status: { type: String, enum: PAYMENT_STATUSES, default: "unpaid" },
      method: String,
      paidAt: Date,
    },
    status: { type: String, enum: ORDER_STATUSES, default: "new", index: true },
    trackingNo: String,
    carrier: String,
    stockApplied: { type: Boolean, default: false },
    timeline: [{ _id: false, at: Date, text: String }],
  },
  { timestamps: true },
);

export type Order = InferSchemaType<typeof OrderSchema>;
export const OrderModel = (models.Order as Model<Order>) || model("Order", OrderSchema);
