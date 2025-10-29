import React, { useState } from "react";
import AppWindow from "../components/AppWindow";

export default function Calculator() {
  const [input, setInput] = useState("");

  const handleClick = (value) => {
    if (value === "C") setInput("");
    else if (value === "=") {
      try {
        setInput(eval(input).toString());
      } catch {
        setInput("Error");
      }
    } else setInput(input + value);
  };

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+",
    "C"
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input type="text" value={input} readOnly style={{ padding: "8px", fontSize: "1.2rem" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
        {buttons.map((btn) => (
          <button key={btn} onClick={() => handleClick(btn)} style={{ padding: "10px" }}>
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
