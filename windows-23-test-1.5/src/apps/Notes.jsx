import React, { useState, useEffect } from "react";
import localforage from "localforage";

export default function Notes() {
  const [notes, setNotes] = useState("");
  
  useEffect(() => {
    localforage.getItem("notes").then((value) => {
      if (value) setNotes(value);
    });
  }, []);

  const handleChange = (e) => {
    setNotes(e.target.value);
    localforage.setItem("notes", e.target.value);
  };

  return (
    <textarea
      value={notes}
      onChange={handleChange}
      style={{ width: "100%", height: "100%", padding: "10px", fontSize: "1rem" }}
    />
  );
}
