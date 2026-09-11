import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeInit } from "@/components/ThemeToggle";
import BootSplash from "@/components/BootSplash";
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
  title: "GovInnovate — Startup-friendly Public Procurement",
  description:
    "A structured end-to-end mechanism for challenge identification, startup discovery, eligibility screening, expert evaluation, sandbox pilots, milestone-based contracting, performance measurement, payment, independent validation and scale-up decisions.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // Nonce forwarded by middleware for the Content-Security-Policy.
  // Note: reading headers here opts the whole app into dynamic rendering.
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeInit nonce={nonce} />
        <BootSplash />
        {children}
      </body>
    </html>
  );
}
