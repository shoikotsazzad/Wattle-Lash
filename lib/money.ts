// Money is stored as integer AUD cents. Prices include GST.

const fmt = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

export const formatAUD = (cents: number) => fmt.format(cents / 100);

export const toCents = (dollars: number) => Math.round(dollars * 100);

/** GST component of a GST-inclusive amount (1/11th in Australia). */
export const gstOf = (cents: number) => Math.round(cents / 11);
