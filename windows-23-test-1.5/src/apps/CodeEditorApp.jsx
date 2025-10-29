import React, { useState, useEffect } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import localforage from "localforage";
import CustomAppPreview from "../components/CustomAppPreview";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";

export default function CodeEditorApp() {
  const [code, setCode] = useState("");

  useEffect(() => {
    localforage.getItem("customCode").then((value) => {
      if (value) setCode(value);
    });
  }, []);

  const handleChange = (editor, data, value) => {
    setCode(value);
    localforage.setItem("customCode", value);
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: 10 }}>
      <div style={{ flex: 1 }}>
        <CodeMirror
          value={code}
          options={{ mode: "javascript", theme: "material", lineNumbers: true }}
          onBeforeChange={handleChange}
        />
      </div>
      <div style={{ flex: 1, border: "1px solid #333" }}>
        <CustomAppPreview code={code} />
      </div>
    </div>
  );
}
