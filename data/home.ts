// Home page copy and images. Cosmetic wording only: no therapeutic claims.

export const home = {
  hero: {
    eyebrow: "Lash. Brow. Eye.",
    heading: ["Lashes made", "for every look"],
    text: "Strip lashes, clusters, serums and tools, delivered Australia-wide.",
    cta: { label: "Shop now", href: "/shop" },
    image: "/images/stock/hero.webp",
    imageAlt: "Close-up portrait of a woman with soft, defined lashes in warm low light",
  },

  collections: {
    eyebrow: "Explore our collections",
    items: [
      { title: "Lashes", href: "/shop/strip-lashes", image: "/images/stock/collection-lashes.webp" },
      { title: "Serums", href: "/shop/lash-serums-and-growth", image: "/images/stock/collection-serums.webp" },
      { title: "Tools", href: "/shop/lash-curlers-and-tools", image: "/images/stock/collection-tools.webp" },
      { title: "Brows", href: "/shop/brow-products", image: "/images/stock/collection-brows.webp" },
    ],
  },

  bestsellers: {
    eyebrow: "Our bestsellers",
    heading: "The ones on repeat",
    link: { label: "View all products", href: "/bestsellers" },
  },

  story: {
    heading: ["More than lashes,", "it's a ritual."],
    text: "Ten quiet minutes in front of the mirror. We stock the lashes, glues, serums and tools that make that time feel easy.",
    cta: { label: "Discover our story", href: "/about" },
    image: "/images/stock/story-mirror.webp",
    imageAlt: "Woman doing her make-up at a mirror lit by warm bulbs",
    polaroids: [
      { image: "/images/stock/polaroid-eye.webp", alt: "Black and white close-up of an eye and lashes" },
      { image: "/images/stock/polaroid-profile.webp", alt: "Profile of a woman with eyes closed in golden light" },
    ],
  },

  lashStyles: {
    eyebrow: "Choose your style",
    heading: ["Lash styles", "for every you"],
    text: "Different looks. Different moods. You choose.",
    link: { label: "Shop all lashes", href: "/shop/strip-lashes" },
    items: [
      { label: "Natural", sub: "Soft & everyday", sku: "WL-STR-001", image: "/images/stock/style-natural.webp" },
      { label: "Doll Eye", sub: "Open & lifted", sku: "WL-STR-003", image: "/images/stock/style-doll-eye.webp" },
      { label: "Wispy", sub: "Full & feathered", sku: "WL-STR-007", image: "/images/stock/style-wispy.webp" },
    ],
  },

  // New section 7
  routine: {
    eyebrow: "How to wear strip lashes",
    heading: "Your lash routine in 4 steps",
    steps: [
      { n: "01", title: "Prep", text: "Start with clean, oil-free lashes so glue grips evenly.", href: "/shop/lash-primers-and-bonders", link: "Shop primers" },
      { n: "02", title: "Glue", text: "Run a thin line of glue along the band and wait 30 seconds until tacky.", href: "/shop/lash-adhesives-and-glues", link: "Shop glues" },
      { n: "03", title: "Apply", text: "Place the band close to your lash line, centre first, then press the corners.", href: "/shop/strip-lashes", link: "Shop lashes" },
      { n: "04", title: "Remove", text: "Lift from the outer corner and clean the band so you can wear them again.", href: "/shop/lash-removers-and-cleansers", link: "Shop removers" },
    ],
  },

  // New section 8
  rails: {
    eyebrow: "Fresh picks",
    tabs: [
      { key: "new", label: "New in" },
      { key: "gifts", label: "Gift sets" },
    ],
    giftBanner: {
      eyebrow: "Gift sets & bundles",
      heading: "Ready to gift",
      text: "Curated sets for birthdays, bridal parties and first-time lash wearers.",
      cta: { label: "Shop gift sets", href: "/shop/gift-sets-and-bundles" },
      image: "/images/stock/gift-box.webp",
      imageAlt: "Pink gift box tied with a ribbon",
    },
  },

  // New section 9
  trust: [
    { icon: "truck", title: "Free shipping over $100", text: "Flat $9.95 standard shipping Australia-wide below that." },
    { icon: "lock", title: "Secure checkout", text: "Test mode: try it with card 4242 4242 4242 4242." },
    { icon: "tag", title: "Prices include GST", text: "What you see is what you pay at checkout." },
    { icon: "leaf", title: "Vegan options", text: "Filter the shop to see products marked vegan." },
  ],
  newsletter: {
    eyebrow: "Join the list",
    heading: "New drops and lash tips, straight to your inbox",
    text: "One or two emails a month. Unsubscribe any time.",
  },
};
