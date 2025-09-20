import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("names").select("*").order("id");
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { name } = req.body;
    const { data, error } = await supabase.from("names").insert({ name }).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  if (req.method === "PUT") {
    const { id, name } = req.body;
    const { data, error } = await supabase.from("names").update({ name }).eq("id", id).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  return res.status(405).end();
}