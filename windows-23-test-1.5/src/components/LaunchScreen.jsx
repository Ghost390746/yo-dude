// src/components/LaunchScreen.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function LaunchScreen({ onLaunchComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLaunchComplete(); // Signal App.jsx to move to BootScreen
    }, 2000); // 2 seconds launch screen
    return () => clearTimeout(timer);
  }, [onLaunchComplete]);

  return (
    <motion.div
      className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      {/* Emoji OS Logo */}
      <motion.div
        className="text-8xl mb-6 select-none"
        initial={{ scale: 0.5, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      >
        🪟
      </motion.div>

      {/* Loading Text */}
      <motion.div
        className="text-2xl font-mono"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        Starting Emoji OS...
      </motion.div>

      {/* Pulsing Indicator */}
      <motion.div
        className="w-6 h-6 mt-10 rounded-full bg-white"
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
