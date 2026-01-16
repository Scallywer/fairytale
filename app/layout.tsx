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

export const metadata: Metadata = {
  title: "Kids Nighttime Stories",
  description: "Bedtime stories for kids in Croatian",
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
        {children}
      </body>
    </html>
  );
}
