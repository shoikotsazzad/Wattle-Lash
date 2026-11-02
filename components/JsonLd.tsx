import { site } from "@/data/site";
import type { ProductView } from "@/lib/types";

/** Renders any JSON-LD object safely. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const abs = (path: string) => new URL(path, site.url).toString();

export function StoreJsonLd() {
  const sameAs = site.socials.map((s) => s.url).filter(Boolean);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": site.schemaType,
        name: site.name,
        description: site.description,
        url: site.url,
        logo: abs(site.logo),
        image: abs(site.ogImage),
        telephone: site.phone,
        email: site.email,
        currenciesAccepted: site.currency,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.suburb,
          addressRegion: site.address.state,
          postalCode: site.address.postcode,
          addressCountry: site.address.country,
        },
        ...(sameAs.length && { sameAs }),
      }}
    />
  );
}

export function ProductJsonLd({ p, categoryName }: { p: ProductView; categoryName: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.name,
        sku: p.sku,
        description: p.description,
        image: [abs(p.image)],
        category: categoryName,
        brand: { "@type": "Brand", name: site.name },
        offers: {
          "@type": "Offer",
          url: abs(`/product/${p.slug}`),
          priceCurrency: "AUD",
          price: (p.price / 100).toFixed(2),
          availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; path: string }[] }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
      }}
    />
  );
}
