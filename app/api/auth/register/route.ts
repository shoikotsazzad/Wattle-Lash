import { cookies } from "next/headers";
import { connectDB, dbEnabled } from "@/lib/db";
import { fail, noDb, ok, readJson } from "@/lib/api";
import { rateLimited } from "@/lib/ratelimit";
import { validateRegister } from "@/lib/validate";
import { hashPassword } from "@/lib/password";
import { createToken, sessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  if (!dbEnabled()) return noDb();
  if (rateLimited(request, "register", 5)) return fail("Too many attempts. Try again later.", 429);
  const result = validateRegister(await readJson(request));
  if (!result.ok) return fail("Please check the form.", 400, { errors: result.errors });

  await connectDB();
  const { UserModel } = await import("@/models/User");
  if (await UserModel.exists({ email: result.data.email })) {
    return fail("An account with this email already exists.", 409, { errors: { email: "Already registered. Log in instead." } });
  }
  const user = await UserModel.create({
    name: result.data.name,
    email: result.data.email,
    passwordHash: await hashPassword(result.data.password),
  });
  (await cookies()).set(sessionCookie(createToken({ uid: String(user._id), role: "customer", v: 0 })));
  return ok({ user: { name: user.name, email: user.email, role: user.role } });
}
