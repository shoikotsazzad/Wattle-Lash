// Light in-memory rate limit per IP (fine for SME traffic; resets per server instance).
const buckets = new Map<string, number[]>();

export function rateLimited(request: Request, key: string, limit = 10, windowMs = 10 * 60 * 1000) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const id = `${key}:${ip}`;
  const now = Date.now();
  const recent = (buckets.get(id) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(id, recent);
  return recent.length > limit;
}
