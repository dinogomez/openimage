"use client";

import "./globals.css";

import { Roboto } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Head from "next/head";
import GoogleCaptchaWrapper from "./GoogleCaptchaWrapper";

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
  return (
    <html lang="en">
      <Head>
        <title>OpenImage Compression</title>
        <meta
          name="description"
          content="Fast Open-Source Bulk Image Compression for Free and Without Ads. Compress Image Free Online"
          key="desc"
        />

        <meta property="og:title" content="OpenImage Free Compression" />
        <meta
          property="og:description"
          content="Open-Source Bulk Image Compression for Free and Without Ads"
        />
        <meta property="og:image" content="https://i.imgur.com/BxZSkiY.png" />
      </Head>
      <Navbar />
      <body className={`${roboto.className} flex flex-col min-h-screen`}>
        <main className="flex-1">
          <GoogleCaptchaWrapper>{children}</GoogleCaptchaWrapper>
          <SpeedInsights />
        </main>
        <Footer />
      </body>
    </html>
  );
}
