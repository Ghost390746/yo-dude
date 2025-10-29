import React from "react";

export default function CustomAppPreview({ code }) {
  return (
    <iframe
      style={{ width: "100%", height: "100%", border: "none" }}
      sandbox="allow-scripts"
      srcDoc={`<html><body><script>${code}<\/script></body></html>`}
    />
  );
}
