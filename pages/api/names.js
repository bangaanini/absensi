import { supabase } from "../../lib/supabase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("names")
      .select("*")
      .order("id");
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Nama wajib diisi" });
    }
    const { data, error } = await supabase
      .from("names")
      .insert({ name })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "PUT") {
    const { id, name } = req.body;
    if (!id || !name || !name.trim()) {
      return res.status(400).json({ error: "Data tidak lengkap" });
    }
    const { data, error } = await supabase
      .from("names")
      .update({ name })
      .eq("id", id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).end();
}