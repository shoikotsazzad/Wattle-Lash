import { buildMetadata } from "@/lib/seo";
import { getBestsellers, getByCategory, getNewest, getProductsBySku, toCard } from "@/lib/catalog";
import { home } from "@/data/home";
import { Hero } from "@/components/home/Hero";
import { Collections } from "@/components/home/Collections";
import { Bestsellers } from "@/components/home/Bestsellers";
import { StoryBand } from "@/components/home/StoryBand";
import { LashStyles } from "@/components/home/LashStyles";
import { Routine } from "@/components/home/Routine";
import { Rails } from "@/components/home/Rails";
import { TrustNewsletter } from "@/components/home/TrustNewsletter";

export const metadata = buildMetadata("home");

// Bestseller row shows one product per category, in this order (like the reference).
const FEATURED_ORDER = ["lash-serums-and-growth", "individual-lash-clusters", "lash-primers-and-bonders", "mascaras", "strip-lashes", "lash-adhesives-and-glues"];

export default async function HomePage() {
  const best = await getBestsellers();
  const picked = FEATURED_ORDER.map((c) => best.find((p) => p.category === c)).filter((p) => p !== undefined);
  const bestsellers = [...picked, ...best.filter((p) => !picked.includes(p))].slice(0, 4).map(toCard);

  const styleProducts = await getProductsBySku(home.lashStyles.items.map((i) => i.sku));
  const styleSlugs = Object.fromEntries(styleProducts.map((p) => [p.sku, p.slug]));

  const lists = {
    // Newest product from 4 different categories (not gift sets, they have their own tab).
    new: (await getNewest(90))
      .filter((p, i, all) => p.category !== "gift-sets-and-bundles" && all.findIndex((x) => x.category === p.category) === i)
      .slice(0, 4)
      .map(toCard),
    gifts: (await getByCategory("gift-sets-and-bundles")).slice(0, 4).map(toCard),
  };

  return (
    <>
      <Hero />
      <Collections />
      <Bestsellers products={bestsellers} />
      <StoryBand />
      <LashStyles slugs={styleSlugs} />
      <Routine />
      <Rails lists={lists} />
      <TrustNewsletter />
    </>
  );
}
