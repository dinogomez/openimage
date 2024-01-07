"use client";
import supabase from "@/lib/supabase/server";
import { useEffect, useState } from "react";
import { formatBytes, timeConvert } from "@/lib/utils";

type Statistics = {
  id: string;
  created_at: string;
  imgconverted: number;
  totalsize: number;
  totalsizeconverted: number;
};

export default function RealtimeStatistics({
  statistics,
}: {
  statistics: Statistics[];
}) {
  const [stats, setStats] = useState(statistics);
  useEffect(() => {
    const channel = supabase
      .channel("realtimeStatistics")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "converts",
        },
        (payload) => {
          console.log(payload);
          setStats([...stats, payload.new as Statistics]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, stats, setStats]);

  const imgConvertedValue = stats.length > 0 ? stats[0].imgconverted : null;
  const totalSizeValue = stats.length > 0 ? stats[0].totalsize : null;
  const totalSizeConvertedValue =
    stats.length > 0 ? stats[0].totalsizeconverted : null;
  const formattedTotalSize = formatBytes(
    (totalSizeValue ?? 0) - (totalSizeConvertedValue ?? 0)
  );
  return (
    <p className="text-gray-500 text-xs">
      {imgConvertedValue} images converted, saving a total of{" "}
      {formattedTotalSize} globally 🌎.
    </p>
  );
}
