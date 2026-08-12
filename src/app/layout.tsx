import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartDrawer } from "@/components/cart-drawer";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Vajčo — Čerstvá vejce z volného chovu | Farma Krnice",
  description:
    "Čerstvá vejce z volného chovu přímo z farmy v Krnici. Slepice ve výběhu, přírodní krmivo, osobní odběr v Brně. Objednejte si vejce online.",
  keywords: [
    "čerstvá vejce",
    "vejce z volného chovu",
    "farma Krnice",
    "vejce Brno",
    "farmářská vejce",
    "výdejní místo vejce",
  ],
  openGraph: {
    title: "Vajčo — Čerstvá vejce z volného chovu",
    description:
      "Čerstvá vejce z volného chovu přímo z farmy v Krnici. Objednejte si je online a vyzvedněte v Brně.",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="cs"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
