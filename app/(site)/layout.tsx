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
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-pink focus:px-4 focus:py-2">Skip to content</a>
      <AnnouncementBar />
      <Header categories={categories} />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <BottomNav />
    </StoreProvider>
  );
}
