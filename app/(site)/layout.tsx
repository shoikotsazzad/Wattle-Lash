import { getCategories } from "@/lib/catalog";
import { AnnouncementBar, Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { StoreProvider } from "@/components/StoreProvider";
import { StoreJsonLd } from "@/components/JsonLd";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const categories = (await getCategories()).map((c) => ({ slug: c.slug, name: c.name }));
  return (
    <StoreProvider>
      <StoreJsonLd />
      {/* Large screens: scale the store up so it keeps the same bold proportions as a 1120px window. */}
      <div className="flex flex-1 flex-col min-[1280px]:[zoom:1.15] min-[1280px]:[--z:1.15] min-[1440px]:[zoom:1.3] min-[1440px]:[--z:1.3] min-[1536px]:[zoom:1.35] min-[1536px]:[--z:1.35] min-[1680px]:[zoom:1.5] min-[1680px]:[--z:1.5] min-[1920px]:[zoom:1.7] min-[1920px]:[--z:1.7] min-[2560px]:[zoom:2] min-[2560px]:[--z:2]">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-pink focus:px-4 focus:py-2">Skip to content</a>
      <AnnouncementBar />
      <Header categories={categories} />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
      </div>
    </StoreProvider>
  );
}
