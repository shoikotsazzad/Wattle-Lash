import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    source: String,
  },
  { timestamps: true },
);

export type Subscriber = InferSchemaType<typeof SubscriberSchema>;
export const SubscriberModel = (models.Subscriber as Model<Subscriber>) || model("Subscriber", SubscriberSchema);
