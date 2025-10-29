import { useState } from "react";

export default function PublicEditor({ user }) {
  const [name, setName] = useState("");
  const [components, setComponents] = useState(""); // Could be JSON or stringified data
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    if (!name || !components) {
      setMessage("Name and components are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/.netlify/functions/publish-system", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ owner: user.username, name, components }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("✅ OS system published successfully!");
        setName("");
        setComponents("");
      } else {
        setMessage(data.error || "Failed to publish system.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error while publishing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="public-editor">
      <h2>Create / Edit OS System</h2>
      <input
        type="text"
        placeholder="System Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />
      <textarea
        placeholder="Components JSON"
        value={components}
        onChange={(e) => setComponents(e.target.value)}
        disabled={loading}
        rows={10}
      />
      <button onClick={handlePublish} disabled={loading}>
        {loading ? "Publishing..." : "Publish"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
