import React, { useState, useEffect } from "react";
import localforage from "localforage";

const defaultBackgrounds = [
  "https://source.unsplash.com/1920x1080/?nature,water",
  "https://source.unsplash.com/1920x1080/?space",
  "https://source.unsplash.com/1920x1080/?city",
];

export default function BackgroundApp({ setDesktopBackground }) {
  const [backgrounds, setBackgrounds] = useState(defaultBackgrounds);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Load saved background index
  useEffect(() => {
    localforage.getItem("bgIndex").then((idx) => {
      if (idx !== null) setSelectedIndex(idx);
      setDesktopBackground(backgrounds[idx || 0]);
    });
  }, []);

  // Handle background change
  const handleSelect = (index) => {
    setSelectedIndex(index);
    setDesktopBackground(backgrounds[index]);
    localforage.setItem("bgIndex", index);
  };

  return (
    <div
      style={{
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        color: "#fff",
      }}
    >
      <h2>Backgrounds</h2>
      <div style={{ display: "flex", gap: 12 }}>
        {backgrounds.map((bg, idx) => (
          <div
            key={idx}
            onClick={() => handleSelect(idx)}
            style={{
              width: 100,
              height: 60,
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              border: selectedIndex === idx ? "3px solid #4ade80" : "2px solid #555",
              cursor: "pointer",
              borderRadius: 6,
            }}
          />
        ))}
      </div>
    </div>
  );
}
