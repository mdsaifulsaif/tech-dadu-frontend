import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import TopDisclosureBar from "@/components/layout/TopDisclosureBar";

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
    <html lang="en" className="h-full antialiased overflow-x-hidden" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('tech-dadu-theme');
                  var theme = saved || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-theme-bg text-theme-fg selection:bg-theme-primary selection:text-theme-primary-fg font-sans overflow-x-clip max-w-full">
        <SessionProvider>
          <ThemeProvider>
            <AnnouncementBar />
            <TopDisclosureBar />
            <Navbar />
            <div className="flex-1 flex flex-col overflow-x-clip w-full max-w-full">{children}</div>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
