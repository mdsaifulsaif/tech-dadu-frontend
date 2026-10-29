import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Tech Dadu | Curated Desk Setup Gear & Modern Web Dev Templates",
  description:
    "Discover top-rated desk accessories, mechanical keyboards, Next.js templates, and modern tech inspirations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-theme-bg text-theme-fg selection:bg-theme-primary selection:text-theme-primary-fg font-sans">
        <SessionProvider>
          <Navbar />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
