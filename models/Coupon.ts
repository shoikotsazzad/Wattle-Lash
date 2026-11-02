import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percent", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 }, // percent (1–100) or cents
    minSubtotal: { type: Number, default: 0 }, // cents
    maxUses: { type: Number, default: 0 }, // 0 = unlimited
    uses: { type: Number, default: 0 },
    expiresAt: Date,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type Coupon = InferSchemaType<typeof CouponSchema>;
export const CouponModel = (models.Coupon as Model<Coupon>) || model("Coupon", CouponSchema);
