import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const CategorySchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export type Category = InferSchemaType<typeof CategorySchema>;
export const CategoryModel = (models.Category as Model<Category>) || model("Category", CategorySchema);
