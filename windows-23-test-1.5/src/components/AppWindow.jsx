import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { AiOutlineClose, AiOutlineMinus, AiOutlineBorder } from "react-icons/ai";

export default function AppWindow({ title, children, defaultSize = { width: 400, height: 300 }, zIndex, onClose, onFocus }) {
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [size, setSize] = useState(defaultSize);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [prevState, setPrevState] = useState({ size, position });

  const handleMaximize = () => {
    if (!maximized) {
      setPrevState({ size, position });
      setSize({ width: window.innerWidth - 20, height: window.innerHeight - 20 });
      setPosition({ x: 10, y: 10 });
      setMaximized(true);
    } else {
      setSize(prevState.size);
      setPosition(prevState.position);
      setMaximized(false);
    }
  };

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, pos) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(pos);
      }}
      bounds="window"
      dragHandleClassName="app-header"
      enableResizing={!maximized}
      style={{ zIndex }}
      minWidth={200}
      minHeight={100}
    >
      <motion.div
        className="app-window"
        layout
        onMouseDown={onFocus}
        style={{
          display: minimized ? "none" : "flex",
          flexDirection: "column",
          background: "#1e1e1e",
          border: "2px solid #555",
          borderRadius: 8,
          overflow: "hidden",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="app-header" style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", cursor: "grab", background: "#333", color: "#fff", userSelect: "none" }}>
          <span>{title}</span>
          <div className="app-controls" style={{ display: "flex", gap: 8 }}>
            <AiOutlineMinus onClick={() => setMinimized(!minimized)} />
            <AiOutlineBorder onClick={handleMaximize} />
            <AiOutlineClose onClick={onClose} />
          </div>
        </div>
        <div className="app-body" style={{ flex: 1, padding: 8, overflow: "auto" }}>
          {children}
        </div>
      </motion.div>
    </Rnd>
  );
}
