import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createMetadata } from "@/lib/metadata";

import "./globals.css";

const headingFont = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"]
});

const bodyFont = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"]
});

const labelFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"]
});

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} ${labelFont.variable}`}>
      <body className="font-sans text-text antialiased">
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:px-8 sm:py-20">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
