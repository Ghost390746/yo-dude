import { useState, useEffect } from "react";

export default function UpdateSubscribe() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/.netlify/functions/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("✅ Subscribed! You will receive updates automatically.");
      } else {
        setMessage("❌ Subscription failed. Try again later.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error while subscribing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-subscribe">
      <h2>Subscribe for Updates</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleSubscribe} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? "Subscribing..." : "Subscribe"}
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
