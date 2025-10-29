// src/system/CustomCursor.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

const emoji = "🖱️"; // Your custom cursor emoji

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clickAnim, setClickAnim] = useState(false);
  const [scrollAnim, setScrollAnim] = useState(false);

  const controls = useAnimation();

  // Track mouse events
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      controls.start({ x: e.clientX - 12, y: e.clientY - 12 });
    };

    const handleClick = () => {
      setClickAnim(true);
      setTimeout(() => setClickAnim(false), 300);
    };

    const handleScroll = () => {
      setScrollAnim(true);
      setTimeout(() => setScrollAnim(false), 500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("wheel", handleScroll);

    // Hide default cursor globally
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("wheel", handleScroll);

      document.head.removeChild(style);
    };
  }, [controls]);

  // Movement animations
  const idleVariants = [
    { scale: 1, rotate: 0 },
    { scale: 1.05, rotate: 5 },
    { scale: 0.95, rotate: -5 },
    { scale: 1, rotate: 10 },
    { scale: 1, rotate: -10 },
  ];

  // Click animations
  const clickVariants = [
    { scale: 0.8, rotate: 360, color: "#4ade80" },
    { scale: 1.3, rotate: -360, color: "#facc15" },
    { scale: 1.2, rotate: 45, color: "#38bdf8" },
    { scale: 1.1, rotate: -45, color: "#f87171" },
  ];

  // Scroll animations
  const scrollVariants = [
    { scale: 1.1, rotate: 15 },
    { scale: 0.9, rotate: -15 },
    { scale: 1, rotate: 20 },
    { scale: 1, rotate: -20 },
  ];

  // Random idle animation every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!clickAnim && !scrollAnim) {
        const variant = idleVariants[Math.floor(Math.random() * idleVariants.length)];
        controls.start(variant);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [clickAnim, scrollAnim, controls]);

  return (
    <AnimatePresence>
      <motion.div
        animate={controls}
        initial={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 24,
          height: 24,
          fontSize: 24,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        <motion.div
          animate={
            clickAnim
              ? clickVariants[Math.floor(Math.random() * clickVariants.length)]
              : scrollAnim
              ? scrollVariants[Math.floor(Math.random() * scrollVariants.length)]
              : {}
          }
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {emoji}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
