// The 15 categories supplied by the brand (notes/assets/brand-and-categories.json),
// plus a stock photo each. Seeded into MongoDB; also the fallback when no DB is set.

export type CategorySeed = {
  slug: string;
  name: string;
  description: string;
  image: string;
  order: number;
};

export const categorySeed: CategorySeed[] = [
  { slug: "strip-lashes", name: "Strip Lashes", description: "Reusable and everyday strip lashes in natural, volume and dramatic styles.", image: "/images/stock/strip-lashes.webp", order: 1 },
  { slug: "individual-lash-clusters", name: "Individual Lash Clusters", description: "Pre-made clusters for DIY and salon lash extensions in a range of curls and lengths.", image: "/images/stock/clusters.webp", order: 2 },
  { slug: "lash-extension-kits", name: "Lash Extension Kits", description: "Complete kits for beginners, at-home use, salon professionals and lash artist training.", image: "/images/stock/extension-kits.webp", order: 3 },
  { slug: "lash-serums-and-growth", name: "Lash Serums and Growth", description: "Conditioning and nourishing serums that help lashes look fuller, stronger and healthier.", image: "/images/stock/serums.webp", order: 4 },
  { slug: "lash-adhesives-and-glues", name: "Lash Adhesives and Glues", description: "Strip lash glues and extension adhesives in clear and black, including low fume and sensitive formulas.", image: "/images/stock/adhesives.webp", order: 5 },
  { slug: "lash-primers-and-bonders", name: "Lash Primers and Bonders", description: "Prep products that degrease and dehydrate the natural lash for longer lasting extensions.", image: "/images/stock/primers.webp", order: 6 },
  { slug: "lash-removers-and-cleansers", name: "Lash Removers and Cleansers", description: "Gentle removers, cleansers and bond breakers for safe glue and extension removal.", image: "/images/stock/removers.webp", order: 7 },
  { slug: "mascaras", name: "Mascaras", description: "Volumising, lengthening, curling and waterproof mascaras for every lash look.", image: "/images/stock/mascaras.webp", order: 8 },
  { slug: "lash-curlers-and-tools", name: "Lash Curlers and Tools", description: "Heated and precision curlers, brushes, combs and tweezers for flawless lashes.", image: "/images/stock/tools.webp", order: 9 },
  { slug: "brow-products", name: "Brow Products", description: "Gels, pencils, powders and tints for defined, full and feathered brows.", image: "/images/stock/brows.webp", order: 10 },
  { slug: "eye-creams-and-under-eye-care", name: "Eye Creams and Under Eye Care", description: "Hydrating and brightening eye treatments for the delicate skin around the eyes and lash line.", image: "/images/stock/eye-care.webp", order: 11 },
  { slug: "lash-lift-and-perm-kits", name: "Lash Lift and Perm Kits", description: "Lash lifting and tinting kits for a curled, defined lash look that lasts up to 8 weeks.", image: "/images/stock/lash-lift.webp", order: 12 },
  { slug: "lash-storage-and-accessories", name: "Lash Storage and Accessories", description: "Cases, trays, stands and holders that keep lash supplies organised and easy to reach.", image: "/images/stock/storage.webp", order: 13 },
  { slug: "gift-sets-and-bundles", name: "Gift Sets and Bundles", description: "Curated sets and bundles for beauty lovers, bridal parties, tech starters and gifting.", image: "/images/stock/gift-sets.webp", order: 14 },
  { slug: "lash-and-beauty-supplements", name: "Lash and Beauty Supplements", description: "Vitamins and beauty supplements formulated to support healthy hair, skin, nails and lashes from within.", image: "/images/stock/supplements.webp", order: 15 },
];

/** Categories whose products need a patch-test / professional-use notice (per brand notes). */
export const patchTestCategories = ["lash-extension-kits", "lash-adhesives-and-glues", "lash-lift-and-perm-kits"];
export const supplementCategories = ["lash-and-beauty-supplements"];
