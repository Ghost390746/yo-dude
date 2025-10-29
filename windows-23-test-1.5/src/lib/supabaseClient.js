import { createClient } from "@supabase/supabase-js";

let supabaseUrl = "";
let supabaseKey = "";
let supabase = null;

// Initialize Supabase dynamically
export const initSupabase = async () => {
  if (supabase) return supabase;

  try {
    const res = await fetch("/.netlify/functions/env");
    const data = await res.json();
    if (!data.success) throw new Error("Failed to load Supabase keys.");

    supabaseUrl = data.env.SUPABASE_URL;
    supabaseKey = data.env.SUPABASE_KEY;
    supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
  } catch (err) {
    console.error("Supabase init error:", err);
    return null;
  }
};

// Getter
export const getSupabase = () => {
  if (!supabase) throw new Error("Supabase client not initialized. Call initSupabase first.");
  return supabase;
};
