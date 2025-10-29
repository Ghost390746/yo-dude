import { useEffect, useState } from "react";
import { initSupabase } from "../lib/supabaseClient";
import OSSystemForm from "./OSSystemForm";
import OSSystemCard from "./OSSystemCard";

export default function Profile({ user }) {
  const [osSystems, setOsSystems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOSSystems = async () => {
    setLoading(true);
    try {
      const supabase = initSupabase();
      const { data, error } = await supabase
        .from("os_systems")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOsSystems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOSSystems();
  }, [user]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>{user.username}'s Profile</h2>

      <OSSystemForm user={user} onCreated={(os) => setOsSystems([os, ...osSystems])} />

      <h3 style={{ marginTop: "20px" }}>Your OS Systems</h3>
      {loading && <p>Loading...</p>}
      {osSystems.length === 0 && <p>No OS Systems yet.</p>}
      {osSystems.map((os) => (
        <OSSystemCard key={os.id} os={os} />
      ))}
    </div>
  );
}
