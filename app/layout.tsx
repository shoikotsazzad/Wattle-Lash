import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { rootMetadata } from "@/lib/seo";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-cormorant" });
const sans = Jost({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jost" });

export const metadata = rootMetadata;
export const viewport = { viewportFit: "cover", themeColor: "#2b1e1e" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.lang} className={`${serif.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
