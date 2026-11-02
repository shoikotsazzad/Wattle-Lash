import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const AddressSchema = new Schema(
  {
    label: String,
    name: String,
    line1: String,
    line2: String,
    suburb: String,
    state: String,
    postcode: String,
    phone: String,
  },
  { _id: true },
);

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    addresses: { type: [AddressSchema], default: [] },
    // Bumped on password change / admin removal to invalidate existing sessions.
    sessionVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof UserSchema>;
export const UserModel = (models.User as Model<User>) || model("User", UserSchema);
