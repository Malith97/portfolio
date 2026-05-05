import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";

import { LanguageProvider } from "@/components/language-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerLanguage } from "@/lib/i18n-server";
import { getDictionary } from "@/lib/i18n";
import { createMetadata, siteDescription, siteUrl } from "@/lib/metadata";

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

const normalizedSiteUrl = siteUrl.endsWith("/")
  ? siteUrl.slice(0, -1)
  : siteUrl;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${normalizedSiteUrl}#person`,
  name: "Malith Ileperuma",
  givenName: "Malith",
  familyName: "Ileperuma",
  url: normalizedSiteUrl,
  jobTitle: "DevOps Engineer",
  image: `${normalizedSiteUrl}/media/malith-portrait.jpg`,
  description: siteDescription,
  knowsAbout: [
    "Cloud Infrastructure",
    "CI/CD",
    "Kubernetes",
    "Terraform",
    "Automation",
    "Reliability Engineering",
  ],
  sameAs: [
    "https://www.linkedin.com/in/malith-ileperuma-8a6a97167",
    "https://github.com/Malith97",
    "https://medium.com/@mileperuma",
    "https://stackoverflow.com/users/10895727/malith-ileperuma",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${normalizedSiteUrl}#website`,
  url: normalizedSiteUrl,
  name: "Malith Ileperuma | DevOps Engineer",
  description: siteDescription,
  inLanguage: "en",
  publisher: {
    "@id": `${normalizedSiteUrl}#person`,
  },
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
        <LanguageProvider initialLanguage={language}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-accent focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:text-text"
          >
            {language === "fi" ? "Siirry pääsisältöön" : "Skip to main content"}
          </a>
          <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />
            <main
              id="main-content"
              className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:px-8 sm:py-20"
            >
              {children}
            </main>
            <SiteFooter builtWithText={t.footer.builtWithCare} />
          </div>
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([personSchema, websiteSchema]),
          }}
        />
      </body>
    </html>
  );
}
