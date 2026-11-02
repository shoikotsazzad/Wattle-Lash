import { Schema, model, models, type Model } from "mongoose";

// Atomic sequence per key (used for daily order numbers).
const CounterSchema = new Schema({ _id: String, seq: { type: Number, default: 0 } });

export const CounterModel = (models.Counter as Model<{ _id: string; seq: number }>) || model("Counter", CounterSchema);

export async function nextSeq(key: string) {
  const doc = await CounterModel.findOneAndUpdate({ _id: key }, { $inc: { seq: 1 } }, { upsert: true, returnDocument: "after" });
  return doc.seq;
}
