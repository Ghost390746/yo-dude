// src/lib/clickSounds.js

// Automatically detect all .wav and .mp3 files in the folder (lazy, no eager loading)
const clickSoundsModules = import.meta.glob('../assets/sounds/*.{wav,mp3}');

// Keep a single audio instance
let currentAudio = null;

// Function to pick and play a random click dynamically
export async function playRandomClickSound() {
  const soundPaths = Object.keys(clickSoundsModules);
  if (soundPaths.length === 0) return;

  // Pick a random file path
  const randomPath = soundPaths[Math.floor(Math.random() * soundPaths.length)];

  try {
    // Dynamically import the chosen file
    const module = await clickSoundsModules[randomPath]();
    const soundSrc = module.default;

    // Stop previous audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    // Create new audio instance and play
    currentAudio = new Audio(soundSrc);
    currentAudio.currentTime = 0;
    await currentAudio.play();
  } catch (err) {
    console.error("Failed to play click sound:", err);
  }
}
