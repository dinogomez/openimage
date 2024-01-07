import supabase from "../server"

export default async function increment(new_img_value:number, new_total_converted_size: number, 
  new_total_size: number, 
  row_id:number){
  
let { data, error } = await supabase
.rpc('incrementStatistics', {
  new_img_value, 
  new_total_converted_size, 
  new_total_size, 
  row_id
})
if (error) return false;

return true;

}