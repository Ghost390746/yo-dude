import { useState } from "react";
import { initSupabase } from "../lib/supabaseClient";

export default function OSSystemForm({ user, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!name || !description) {
      setMessage("⚠️ Fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const supabase = initSupabase();
      if (!supabase) throw new Error("Supabase not initialized");

      const { error, data } = await supabase.from("os_systems").insert([
        {
          name,
          description,
          owner_id: user.id,
        },
      ]);

      if (error) throw error;

      setMessage("✅ OS System created!");
      setName("");
      setDescription("");
      if (onCreated) onCreated(data[0]);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error creating OS system.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <input
        type="text"
        placeholder="OS Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <textarea
        placeholder="OS Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create OS System"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
