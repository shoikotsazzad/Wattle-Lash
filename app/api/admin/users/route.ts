import { requireAdmin } from "@/lib/auth";
import { fail, ok, readJson } from "@/lib/api";
import { EMAIL, str } from "@/lib/validate";
import { hashPassword } from "@/lib/password";

export async function GET() {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const { UserModel } = await import("@/models/User");
  const admins = await UserModel.find({ role: "admin" }).sort({ createdAt: 1 }).select("name email createdAt").lean();
  return ok({ me: admin.id, admins: admins.map((u) => ({ id: String(u._id), name: u.name, email: u.email, createdAt: u.createdAt?.toISOString() })) });
}

// Promote an existing account, or create a new admin with a starting password.
export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (admin instanceof Response) return admin;
  const b = await readJson(request);
  const email = str(b?.email, 120).toLowerCase();
  const name = str(b?.name, 100);
  const password = typeof b?.password === "string" ? b.password : "";
  if (!EMAIL.test(email)) return fail("Enter a valid email.", 400, { errors: { email: "Enter a valid email." } });

  const { UserModel } = await import("@/models/User");
  const existing = await UserModel.findOne({ email });
  if (existing) {
    existing.role = "admin";
    existing.sessionVersion = (existing.sessionVersion ?? 0) + 1;
    await existing.save();
    return ok({ promoted: true });
  }
  if (name.length < 2) return fail("Enter a name.", 400, { errors: { name: "Enter a name." } });
  if (password.length < 10) return fail("Password needs 10+ characters.", 400, { errors: { password: "Use at least 10 characters." } });
  await UserModel.create({ email, name, role: "admin", passwordHash: await hashPassword(password) });
  return ok({ created: true });
}
