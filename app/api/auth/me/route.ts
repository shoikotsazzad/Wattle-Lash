import { getAuthUser } from "@/lib/auth";
import { ok } from "@/lib/api";

export async function GET() {
  const user = await getAuthUser();
  return ok({ user });
}
