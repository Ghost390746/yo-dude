// src/system/Search.jsx
import React, { useState } from "react";
import { useSystemStore } from "../store/systemStore";

export default function Search() {
  const { desktopApps, openApp } = useSystemStore();
  const [query, setQuery] = useState("");

  const allApps = [
    { name: "Explorer" },
    { name: "Settings" },
    { name: "Terminal" },
    { name: "Project Publisher" },
    { name: "Web Bro Web Store" },
    { name: "WebBoe Browser" },
    { name: "FireBox" },
    { name: "Web Bro OS Mini" },
    ...desktopApps,
  ];

  const filteredApps = allApps.filter(app =>
    app.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: 8, background: "#0b1b2a", borderRadius: 6, minWidth: 200 }}>
      <input
        type="text"
        placeholder="Search apps..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: 6, borderRadius: 4, border: "none" }}
      />
      <ul style={{ marginTop: 8, listStyle: "none", padding: 0, maxHeight: 200, overflowY: "auto" }}>
        {filteredApps.map(app => (
          <li
            key={app.name}
            style={{ cursor: "pointer", padding: "4px 2px" }}
            onClick={() => openApp(app.name)}
          >
            {app.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
