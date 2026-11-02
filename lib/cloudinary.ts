// Signed direct uploads to Cloudinary from the admin portal (the secret never leaves the server).
import { createHash } from "node:crypto";

export const cloudinaryEnabled = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

export function uploadSignature(folder = "wattle-and-lash/products") {
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(toSign + process.env.CLOUDINARY_API_SECRET).digest("hex");
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    folder,
    timestamp,
    signature,
  };
}
