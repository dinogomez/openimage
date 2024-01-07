import supabase from "@/lib/supabase/server";
import RealtimeStatistics from "./RealtimeStatistics";

export const revalidate = 0;

export default async function Statistics() {
  const { data } = await supabase.from("converts").select();

  // Check if data is an array and each element has the required properties

  return <RealtimeStatistics statistics={data ?? []} />;
}
