"use client";
import supabase from "@/lib/supabase/server";
import RealtimeStatistics from "./RealtimeStatistics";
import { useState, useEffect } from "react";
import { formatBytes } from "@/lib/utils";

export const revalidate = 0;

type Statistic = {
  id: string;
  created_at: string;
  imgconverted: number;
  totalsize: number;
  totalsizeconverted: number;
};

export default function StatisticUpdate({
  statistic,
}: {
  statistic: Statistic;
}) {
  const [stat, setStat] = useState(statistic);
  const id = 1;
  useEffect(() => {
    const channel = supabase
      .channel("realtimeStatistics")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "converts",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          setStat(payload.new as Statistic);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, stat, setStat]);

  return (
    <h1 className="text-gray-500 text-xs ">
      {stat.imgconverted.toLocaleString()} img converted, compressing{" "}
      {formatBytes(stat.totalsize - stat.totalsizeconverted)} globally{" "}
      <span className="animate-pulse">🌎</span>
    </h1>
  );
}
