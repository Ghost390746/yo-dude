// src/apps/Webs.jsx
import React from "react";
import CodeEditorIDE from "../components/CodeEditorIDE";

export default function WebsApp({ user, onClose }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        border: "2px solid #333",
        borderRadius: "8px",
        backgroundColor: "#1e1e1e",
        color: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      }}
    >
      {/* App Header */}
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #444",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#2d2d2d",
        }}
      >
        <h3 style={{ margin: 0 }}>Webs IDE</h3>
        <button
          onClick={onClose}
          style={{
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "2px 8px",
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      </div>

      {/* Editor */}
      <div style={{ flex: 1 }}>
        <CodeEditorIDE user={user} />
      </div>
    </div>
  );
}
