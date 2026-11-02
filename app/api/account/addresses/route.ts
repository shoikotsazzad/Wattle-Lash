import { requireUser } from "@/lib/auth";
import { fail, ok, readJson } from "@/lib/api";
import { validateAddress, str, type FieldErrors } from "@/lib/validate";

export async function GET() {
  const user = await requireUser();
  if (user instanceof Response) return user;
  const { UserModel } = await import("@/models/User");
  const u = await UserModel.findById(user.id).lean();
  return ok({ user, addresses: (u?.addresses ?? []).map((a) => ({ ...a, _id: String(a._id) })) });
}

// Replaces the saved address list (max 5).
export async function PUT(request: Request) {
  const user = await requireUser();
  if (user instanceof Response) return user;
  const body = await readJson(request);
  const list = Array.isArray(body?.addresses) ? body.addresses.slice(0, 5) : [];
  const errors: FieldErrors = {};
  const addresses = list.map((a: unknown, i: number) => ({
    label: str((a as Record<string, unknown>)?.label, 40) || `Address ${i + 1}`,
    ...validateAddress(a, errors, `${i}.`),
  }));
  if (Object.keys(errors).length) return fail("Please check the address.", 400, { errors });
  const { UserModel } = await import("@/models/User");
  await UserModel.updateOne({ _id: user.id }, { $set: { addresses } });
  return ok();
}
