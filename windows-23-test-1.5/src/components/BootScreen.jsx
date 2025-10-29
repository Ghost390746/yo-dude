import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import TypeIt from "typeit";
import anime from "animejs";
import localforage from "localforage";
import "./BootScreen.css";

// ✅ Correct path for startup sound
import startupSoundFile from "../assets/sounds/startup.wav";

export default function BootScreen({ onFinish }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [subStage, setSubStage] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);
  const bootRef = useRef(null);
  const progressRef = useRef(null);

  // Preload startup sound with useRef
  const startupSound = useRef(new Audio(startupSoundFile));

  const bootStages = [
    {
      name: "BIOS",
      text: [
        "Initializing BIOS...",
        "Detecting CPU & RAM...",
        "Checking storage devices...",
      ],
      duration: [2000, 2000, 2000],
    },
    {
      name: "Bootloader",
      text: ["Press ENTER to boot Windows23 OS", "Press ESC for setup..."],
      duration: [3000, 3000],
      prompt: true,
    },
    {
      name: "Kernel",
      text: [
        "Loading Kernel Modules...",
        "Starting System Services...",
        "Initializing Drivers...",
      ],
      duration: [3000, 4000, 4000],
    },
    {
      name: "Desktop",
      text: ["Preparing Desktop Environment...", "Finalizing Boot..."],
      duration: [4000, 3000],
    },
  ];

  const totalDuration = bootStages.flatMap((s) => s.duration).reduce((a, b) => a + b, 0);

  useEffect(() => {
    localforage.getItem("bootFinished").then((finished) => {
      if (finished) return onFinish?.();

      // ✅ Play startup sound at beginning
      startupSound.current.currentTime = 0;
      startupSound.current.volume = 0.7;
      startupSound.current.play().catch((err) => {
        console.warn("Startup sound could not autoplay:", err);
      });

      let elapsed = 0;

      const runStage = async () => {
        for (let i = 0; i < bootStages.length; i++) {
          setStageIndex(i);
          const stage = bootStages[i];

          for (let j = 0; j < stage.text.length; j++) {
            setSubStage(j);
            const stageStart = elapsed;
            const stageEnd = elapsed + stage.duration[j];

            anime({
              targets: progressRef.current,
              width: [`${(stageStart / totalDuration) * 100}%`, `${(stageEnd / totalDuration) * 100}%`],
              easing: "linear",
              duration: stage.duration[j],
            });

            await new Promise((resolve) => {
              new TypeIt(`#stage-${i}-${j}`, {
                strings: stage.text[j],
                speed: 40,
                cursor: true,
                waitUntilVisible: true,
                afterComplete: () => resolve(),
              }).go();
            });

            gsap.fromTo(
              `#stage-${i}-${j}`,
              { opacity: 0.2 },
              { opacity: 1, duration: 0.5, repeat: 1, yoyo: true }
            );

            elapsed += stage.duration[j];
          }

          if (stage.prompt) {
            setShowPrompt(true);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setShowPrompt(false);
          }
        }

        localforage.setItem("bootFinished", true);
        onFinish?.();
      };

      runStage();
    });
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        ref={bootRef}
        className="fixed inset-0 bg-black text-green-400 font-mono flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Logo */}
        <motion.div
          className="text-6xl mb-6 select-none"
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: -1, duration: 10, ease: "linear" }}
        >
          🪟
        </motion.div>

        {/* Boot Text */}
        <div className="flex flex-col items-start w-96">
          {bootStages.map((stage, i) =>
            stage.text.map((_, j) => (
              <div
                key={`${i}-${j}`}
                id={`stage-${i}-${j}`}
                className="mb-1 text-left text-lg w-full"
              />
            ))
          )}
        </div>

        {/* Progress bar */}
        <div className="w-3/4 h-2 bg-gray-800 rounded overflow-hidden mt-4 shadow-inner">
          <div ref={progressRef} className="h-2 bg-green-400 w-0"></div>
        </div>

        {/* Bouncing dots */}
        <motion.div
          className="flex space-x-2 mt-3"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <div className="w-3 h-3 bg-green-400 rounded-full" />
          <div className="w-3 h-3 bg-green-400 rounded-full" />
          <div className="w-3 h-3 bg-green-400 rounded-full" />
        </motion.div>

        {/* Prompt screen */}
        {showPrompt && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-green-400 p-6 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p>Press ENTER to boot Windows23 OS</p>
            <p>Press ESC for setup</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
