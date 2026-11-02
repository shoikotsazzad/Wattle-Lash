import { cookies } from "next/headers";
import { connectDB, dbEnabled } from "@/lib/db";
import { fail, noDb, ok, readJson } from "@/lib/api";
import { rateLimited } from "@/lib/ratelimit";
import { str } from "@/lib/validate";
import { verifyPassword } from "@/lib/password";
import { createToken, sessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  if (!dbEnabled()) return noDb();
  if (rateLimited(request, "login", 10)) return fail("Too many attempts. Try again in a few minutes.", 429);
  const body = await readJson(request);
  const email = str(body?.email, 120).toLowerCase();
  const password = typeof body?.password === "string" ? body.password : "";

  await connectDB();
  const { UserModel } = await import("@/models/User");
  const user = await UserModel.findOne({ email });
  if (!user || !(await verifyPassword(password, user.passwordHash))) return fail("Email or password is incorrect.", 401);

  const role = user.role as "customer" | "admin";
  (await cookies()).set(sessionCookie(createToken({ uid: String(user._id), role, v: user.sessionVersion ?? 0 })));
  return ok({ user: { name: user.name, email: user.email, role } });
}
