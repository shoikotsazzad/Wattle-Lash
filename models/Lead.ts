import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const LeadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    orderNo: String,
    message: { type: String, required: true },
    page: String,
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true },
);

export type Lead = InferSchemaType<typeof LeadSchema>;
export const LeadModel = (models.Lead as Model<Lead>) || model("Lead", LeadSchema);
