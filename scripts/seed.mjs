// Seeds categories + products from the brand files and creates the first admin.
// Usage: npm run seed   (reads .env.local). Safe to re-run: upserts by slug / SKU.
// Existing products keep their stock, images and edits unless you pass --reset.
import { readFileSync } from "node:fs";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import mongoose from "mongoose";

const reset = process.argv.includes("--reset");
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local first.");
  process.exit(1);
}

const slugify = (s) => s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

// Category seed lives in data/categories.ts; parse the array out of it to avoid a TS build step.
const catSrc = readFileSync(new URL("../data/categories.ts", import.meta.url), "utf8");
const categories = [...catSrc.matchAll(/\{ slug: "([^"]+)", name: "([^"]+)", description: "([^"]+)", image: "([^"]+)", order: (\d+) \}/g)].map(
  ([, slug, name, description, image, order]) => ({ slug, name, description, image, order: Number(order) }),
);
const { products } = JSON.parse(readFileSync(new URL("../notes/assets/products.json", import.meta.url), "utf8"));

await mongoose.connect(uri);
const db = mongoose.connection.db;
const now = new Date();

const catOps = categories.map((c) => ({
  updateOne: reset
    ? { filter: { slug: c.slug }, update: { $set: { ...c, updatedAt: now }, $setOnInsert: { createdAt: now } }, upsert: true }
    : { filter: { slug: c.slug }, update: { $setOnInsert: { ...c, createdAt: now, updatedAt: now } }, upsert: true },
}));
const catRes = await db.collection("categories").bulkWrite(catOps);

const prodOps = products.map((p, i) => {
  const doc = {
    sku: p.sku,
    slug: slugify(p.name),
    category: p.category,
    name: p.name,
    description: p.description,
    size: p.size,
    price: Math.round(p.price_aud * 100),
    stock: p.stock_qty,
    bestseller: Boolean(p.bestseller),
    vegan: Boolean(p.vegan),
    images: [],
    active: true,
  };
  // Spread createdAt so "New in" has a stable order (later SKUs = newer).
  const createdAt = new Date(now.getTime() - (products.length - i) * 60_000);
  return {
    updateOne: reset
      ? { filter: { sku: p.sku }, update: { $set: { ...doc, updatedAt: now }, $setOnInsert: { createdAt } }, upsert: true }
      : { filter: { sku: p.sku }, update: { $setOnInsert: { ...doc, createdAt, updatedAt: now } }, upsert: true },
  };
});
const prodRes = await db.collection("products").bulkWrite(prodOps);
await db.collection("products").createIndex({ sku: 1 }, { unique: true });
await db.collection("products").createIndex({ slug: 1 }, { unique: true });

console.log(`Categories: ${catRes.upsertedCount} added, ${catRes.modifiedCount} updated`);
console.log(`Products:   ${prodRes.upsertedCount} added, ${prodRes.modifiedCount} updated (${products.length} in file)`);

// The admin in .env.local is the source of truth: changing it and re-running the seed updates
// the existing admin instead of leaving the old login active next to a new one.
const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim();
if (email && password) {
  const users = db.collection("users");
  const hashPassword = async () => {
    const salt = randomBytes(16).toString("hex");
    const hash = await promisify(scrypt)(password, salt, 64);
    return `scrypt$${salt}$${hash.toString("hex")}`;
  };
  const passwordMatches = async (stored) => {
    const [, salt, hash] = String(stored).split("$");
    if (!salt || !hash) return false;
    return (await promisify(scrypt)(password, salt, 64)).toString("hex") === hash;
  };

  const admins = await users.find({ role: "admin" }).toArray();
  const byEmail = await users.findOne({ email });
  // Same email, or the store's only admin moving to a new email.
  const target = byEmail ?? (admins.length === 1 ? admins[0] : null);

  if (target) {
    const samePassword = await passwordMatches(target.passwordHash);
    const set = { role: "admin", email, updatedAt: now };
    if (name) set.name = name;
    if (!samePassword) set.passwordHash = await hashPassword();
    const loginChanged = target.email !== email || !samePassword || target.role !== "admin";
    await users.updateOne({ _id: target._id }, loginChanged ? { $set: set, $inc: { sessionVersion: 1 } } : { $set: set });
    console.log(`Admin:      ${email} ${loginChanged ? "updated, please log in again" : "up to date"}`);
  } else {
    await users.insertOne({
      email,
      name: name || "Store admin",
      passwordHash: await hashPassword(),
      role: "admin",
      addresses: [],
      sessionVersion: 0,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Admin:      ${email} created`);
    if (admins.length) console.log(`            ${admins.length} other admin account(s) still exist. Remove any you don't need in Admin users.`);
  }
} else {
  console.log("Admin:      skipped (set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local)");
}

await mongoose.disconnect();
