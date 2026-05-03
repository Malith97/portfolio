import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerLanguage } from "@/lib/i18n-server";
import { getDictionary } from "@/lib/i18n";
import { createMetadata, siteUrl } from "@/lib/metadata";

import "./globals.css";
import "leaflet/dist/leaflet.css";

const headingFont = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
});

const bodyFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
});

const labelFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = createMetadata();

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Malith Ileperuma",
  url: siteUrl,
  jobTitle: "DevOps Engineer",
  image: `${siteUrl}/media/malith-portrait.jpg`,
  sameAs: [
    "https://www.linkedin.com/in/malith-ileperuma-8a6a97167",
    "https://github.com/Malith97",
    "https://medium.com/@mileperuma",
    "https://stackoverflow.com/users/10895727/malith-ileperuma",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const language = await getServerLanguage();
  const t = getDictionary(language);

  return (
    <html
      lang={language === "fi" ? "fi" : "en"}
      className={`${headingFont.variable} ${bodyFont.variable} ${labelFont.variable}`}
    >
      <body className="font-sans text-text antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-accent focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:text-text"
        >
          {language === "fi" ? "Siirry pääsisältöön" : "Skip to main content"}
        </a>
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader initialLanguage={language} />
          <main
            id="main-content"
            className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:px-8 sm:py-20"
          >
            {children}
          </main>
          <SiteFooter builtWithText={t.footer.builtWithCare} />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema),
          }}
        />
      </body>
    </html>
  );
}
