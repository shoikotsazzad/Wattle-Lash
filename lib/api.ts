// Small helpers for route handlers.

export const ok = (data: Record<string, unknown> = {}, init?: ResponseInit) => Response.json({ ok: true, ...data }, init);

export const fail = (error: string, status = 400, extra: Record<string, unknown> = {}) =>
  Response.json({ ok: false, error, ...extra }, { status });

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export const noDb = () => fail("The database is not configured yet (MONGODB_URI).", 503);

/** Escape user input for use inside a RegExp. */
export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function toCsv(rows: (string | number | undefined | null)[][]) {
  return rows
    .map((r) => r.map((v) => {
      const s = v == null ? "" : String(v);
      // Neutralise spreadsheet formulas and quote every cell.
      const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
      return `"${safe.replace(/"/g, '""')}"`;
    }).join(","))
    .join("\n");
}
