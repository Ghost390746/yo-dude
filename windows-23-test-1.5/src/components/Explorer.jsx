import { useEffect, useState } from "react";

export default function Explorer() {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSystems = async () => {
      setLoading(true);
      try {
        const res = await fetch("/.netlify/functions/get-systems");
        const data = await res.json();
        if (res.ok && data.success) {
          setSystems(data.systems);
        } else {
          setError(data.error || "Failed to load systems.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error while fetching systems.");
      } finally {
        setLoading(false);
      }
    };

    fetchSystems();
  }, []);

  return (
    <div className="explorer">
      <h2>Explorer</h2>
      {loading && <p>Loading OS systems...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {systems.map((sys) => (
          <li key={sys.id}>
            <strong>{sys.name}</strong> by {sys.owner}
            {/* Add a button to view/edit if needed */}
          </li>
        ))}
      </ul>
    </div>
  );
}
