import { connectDB, dbEnabled } from "@/lib/db";
import { fail, noDb, ok, readJson } from "@/lib/api";
import { rateLimited } from "@/lib/ratelimit";
import { EMAIL, str } from "@/lib/validate";

export async function POST(request: Request) {
  if (!dbEnabled()) return noDb();
  if (rateLimited(request, "newsletter", 5)) return fail("Too many requests. Try again later.", 429);
  const body = await readJson(request);
  const email = str(body?.email, 120).toLowerCase();
  if (!EMAIL.test(email)) return fail("Enter a valid email address.");

  await connectDB();
  const { SubscriberModel } = await import("@/models/Subscriber");
  await SubscriberModel.updateOne({ email }, { $setOnInsert: { email, source: str(body?.source, 60) || "site" } }, { upsert: true });
  return ok();
}
