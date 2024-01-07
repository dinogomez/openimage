"use client";

import "./globals.css";

import { Roboto } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Head from "next/head";
import GoogleCaptchaWrapper from "./GoogleCaptchaWrapper";
import { usePathname } from "next/navigation";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={`${roboto.className} flex flex-col min-h-screen`}>
        <main className="flex-1">
          <Navbar pathname={pathname} />
          <GoogleCaptchaWrapper>{children}</GoogleCaptchaWrapper>
          <SpeedInsights />
        </main>
        <Footer />
      </body>
    </html>
  );
}
