import Dropzone from "@/components/Dropzone";
import StatisticUpdate from "@/components/RealtimeStatisticUpdate";
import supabase from "@/lib/supabase/server";
import Head from "next/head";
export const revalidate = 0;

export default async function Home() {
  const id: number = 1;
  const { data } = await supabase
    .from("converts")
    .select()
    .match({ id })
    .single();

  return (
    <div>
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
      <div className="container font-mono">
        <div className="flex flex-col md:flex-row items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl">🚀 upload</h2>
          </div>
          <div>
            <StatisticUpdate statistic={data} />
          </div>
        </div>
        <Dropzone className="p-16   bg-gray-100 border-dashed border-gray-200 flex justify-center items-center text-gray-500 border-2" />
      </div>
    </div>
  );
}
