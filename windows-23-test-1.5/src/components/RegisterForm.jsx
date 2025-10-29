import { useState } from "react";
import { initSupabase } from "../lib/supabaseClient";

export default function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [step, setStep] = useState(1); // 1=register, 2=verify, 3=preferences
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const [preference, setPreference] = useState(""); // personal | business
  const [pendingUser, setPendingUser] = useState(null);

  const generateCode = () =>
    crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();

  const handleRegister = async () => {
    if (!email || !username || !password) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const codeValue = generateCode();
      setGeneratedCode(codeValue);

      if (twoStepEnabled) {
        const res = await fetch("/.netlify/functions/sendVerification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, code: codeValue }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setMessage(`❌ Failed to send verification email: ${data.error}`);
          setLoading(false);
          return;
        }
      }

      setStep(2);
      setMessage(`✅ Verification code generated! Enter it below.`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code) {
      setMessage("⚠️ Enter your verification code.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      if (code.toUpperCase() === generatedCode) {
        const supabase = await initSupabase();
        const { error, data } = await supabase.from("users").insert([
          {
            email,
            username,
            password,
            two_step_enabled: twoStepEnabled,
          },
        ]).select();

        if (error) {
          console.error(error);
          setMessage("❌ Failed to save user in Supabase.");
          setLoading(false);
          return;
        }

        // Save user temporarily until preferences done
        setPendingUser(data[0]);
        setStep(3);
        setMessage("✅ Verification successful! Choose your project preference.");
      } else {
        setMessage("❌ Verification failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during verification.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceDone = async () => {
    if (!preference) {
      setMessage("⚠️ Please select a preference.");
      return;
    }

    const supabase = await initSupabase();
    const { error } = await supabase
      .from("users")
      .update({ preference })
      .eq("id", pendingUser.id);

    if (error) console.error(error);

    // Finalize registration → go to App
    onRegister({ ...pendingUser, preference });
  };

  return (
    <div style={containerStyle}>
      {step === 1 && (
        <div>
          <h2>Register for WebBro OS</h2>
          <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={inputStyle} disabled={loading}/>
          <input type="text" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={inputStyle} disabled={loading}/>
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={inputStyle} disabled={loading}/>
          <label>
            <input type="checkbox" checked={twoStepEnabled} onChange={()=>setTwoStepEnabled(s=>!s)} disabled={loading}/> Enable 2-Step Email Verification
          </label>
          <button onClick={handleRegister} disabled={loading} style={buttonStyle}>
            {loading ? "Registering..." : "Register & Generate Verification"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Enter Verification Code</h2>
          <input type="text" placeholder="Verification code" value={code} onChange={e=>setCode(e.target.value)} style={inputStyle} disabled={loading}/>
          <button onClick={handleVerify} disabled={loading} style={buttonStyle}>
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Select Your Project Preference</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <label>
              <input type="radio" name="preference" value="personal" checked={preference==="personal"} onChange={e=>setPreference(e.target.value)}/> Personal Work
            </label>
            <label>
              <input type="radio" name="preference" value="business" checked={preference==="business"} onChange={e=>setPreference(e.target.value)}/> Business / Professional
            </label>
          </div>
          <button onClick={handlePreferenceDone} style={{ ...buttonStyle, marginTop:15 }}>Done</button>
        </div>
      )}

      {message && <p style={{ color: message.startsWith("✅") ? "#0f0":"#ff5555", marginTop:15 }}>{message}</p>}
    </div>
  );
}

const containerStyle = { textAlign:"center", marginTop:60, background:"rgba(0,0,0,0.7)", color:"#fff", padding:30, borderRadius:10, width:350, marginLeft:"auto", marginRight:"auto"};
const inputStyle = { display:"block", width:"100%", padding:10, marginBottom:10, borderRadius:6, border:"1px solid #555", background:"#111", color:"#fff", outline:"none"};
const buttonStyle = { padding:"10px 20px", background:"cyan", color:"#000", border:"none", borderRadius:6, cursor:"pointer", fontWeight:"bold" };
