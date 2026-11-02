import { requireAdmin } from "@/lib/auth";
import { fail, ok } from "@/lib/api";
import { cloudinaryEnabled, uploadSignature } from "@/lib/cloudinary";

// Returns a short-lived signature; the browser uploads straight to Cloudinary.
export async function POST() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  if (!cloudinaryEnabled()) return fail("Cloudinary is not configured (CLOUDINARY_* env vars).", 503);
  return ok(uploadSignature());
}
