import { validateContact } from "@/lib/validate";
import { connectDB, dbEnabled } from "@/lib/db";
import { fail, noDb, ok, readJson } from "@/lib/api";
import { rateLimited } from "@/lib/ratelimit";

export async function POST(request: Request) {
  if (!dbEnabled()) return noDb();
  if (rateLimited(request, "contact", 5)) return fail("Too many requests. Please try again later.", 429);

  const result = validateContact(await readJson(request));
  if (!result.ok) return fail("Please check the form.", 400, { errors: result.errors });

  try {
    await connectDB();
    const { LeadModel } = await import("@/models/Lead");
    await LeadModel.create(result.data);
    return ok();
  } catch (err) {
    console.error("Lead save failed", err);
    return fail("Could not send your message. Please email us instead.", 500);
  }
}
