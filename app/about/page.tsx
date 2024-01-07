import CostCard from "@/components/CostCard";
import AboutCard from "@/components/AboutCard";
import Head from "next/head";
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
