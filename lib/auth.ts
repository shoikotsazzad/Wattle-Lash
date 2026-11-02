// Server-side auth checks for route handlers. Always re-checks the user in the DB.
import { cookies } from "next/headers";
import { connectDB, dbEnabled } from "@/lib/db";
import { SESSION_COOKIE, verifyToken } from "@/lib/session";

export type AuthUser = { id: string; email: string; name: string; role: "customer" | "admin" };

export async function getAuthUser(): Promise<AuthUser | null> {
  if (!dbEnabled()) return null;
  const session = verifyToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  await connectDB();
  const { UserModel } = await import("@/models/User");
  const user = await UserModel.findById(session.uid).lean();
  if (!user || (user.sessionVersion ?? 0) !== session.v) return null;
  return { id: String(user._id), email: user.email, name: user.name, role: user.role as AuthUser["role"] };
}

export async function requireUser() {
  const user = await getAuthUser();
  return user ?? Response.json({ ok: false, error: "Please log in." }, { status: 401 });
}

export async function requireAdmin() {
  const user = await getAuthUser();
  if (!user) return Response.json({ ok: false, error: "Please log in." }, { status: 401 });
  if (user.role !== "admin") return Response.json({ ok: false, error: "Admins only." }, { status: 403 });
  return user;
}
