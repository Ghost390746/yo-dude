import { useState, useEffect } from "react";
import { initSupabase } from "../lib/supabaseClient"; // dynamic init

export default function LoginForm({ onLogin }) {
  const [supabase, setSupabase] = useState(null);
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize Supabase on mount
  useEffect(() => {
    const setup = async () => {
      const client = await initSupabase();
      if (client) setSupabase(client);
      else setMessage("❌ Failed to initialize database.");
    };
    setup();
  }, []);

  const handleLogin = async () => {
    if (!supabase) {
      setMessage("Supabase not initialized yet.");
      return;
    }

    if (!identifier || !password) {
      setMessage("⚠️ Please enter both username/email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Try to find user by email or username
      const { data: users, error } = await supabase
        .from("users")
        .select("*")
        .or(`email.eq.${identifier},username.eq.${identifier}`)
        .limit(1);

      if (error) throw error;

      const user = users[0];
      if (!user) {
        setMessage("❌ No user found with that email or username.");
        return;
      }

      // Plain text password check
      if (password !== user.password) {
        setMessage("❌ Invalid password.");
        return;
      }

      setMessage(`✅ Welcome back, ${user.username}!`);
      onLogin(user);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form" style={containerStyle}>
      <h2 style={{ marginBottom: "20px" }}>Login to WebBro OS</h2>

      <input
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        disabled={loading}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        style={inputStyle}
      />

      <button onClick={handleLogin} disabled={loading} style={buttonStyle}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && (
        <p
          style={{
            marginTop: "15px",
            fontSize: "14px",
            color: message.startsWith("✅") ? "#0f0" : "#ff5555",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const containerStyle = {
  textAlign: "center",
  marginTop: "60px",
  background: "rgba(0, 0, 0, 0.7)",
  color: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "350px",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #555",
  background: "#111",
  color: "#fff",
  outline: "none",
};

const buttonStyle = {
  padding: "10px 20px",
  background: "cyan",
  color: "#000",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
