import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = "Priče za laku noć";
const siteDescription = "Lijepe priče za djecu prije spavanja";
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pricezalakunoc.hr";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteName,
    template: "%s | Priče za laku noć",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    siteName,
    title: siteName,
    description: siteDescription,
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-amber-200`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded-lg focus:text-sm"
        >
          Preskoči na sadržaj
        </a>
        {children}
      </body>
    </html>
  );
}
