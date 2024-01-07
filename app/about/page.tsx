import CostCard from "@/components/CostCard";
import AboutCard from "@/components/AboutCard";
import Head from "next/head";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About OpenImage.dev - Free Image Compression without Ads",
  description:
    "Effortlessly compress 4K, 1440p, and 1080p image files with our ad-free service. Support for various formats. Compress and download images with ease at OpenImage.dev.",
};

export default function About() {
  return (
    <div className="">
      <Head>
        <title>OpenImage Compression</title>
        <meta
          name="description"
          content="Open-Source Bulk Image Compression for Free and Without Ads. "
          key="desc"
        />

        <meta property="og:title" content="OpenImage Free Compression" />
        <meta
          property="og:description"
          content="Open-Source Bulk Image Compression for Free and Without Ads"
        />
        <meta property="og:image" content="https://i.imgur.com/BxZSkiY.png" />
      </Head>
      <AboutCard />
      <CostCard />
    </div>
  );
}
