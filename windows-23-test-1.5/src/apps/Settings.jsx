import React, { useState, useEffect } from "react";
import { useSystemStore } from "../store/systemStore";

export default function Settings() {
  const { setWallpaper, setTheme, drives, createDrive } = useSystemStore();

  // Appearance
  const [wallpaper, setLocalWallpaper] = useState(localStorage.getItem("wb_wallpaper") || "");
  const [theme, setLocalTheme] = useState(localStorage.getItem("wb_theme") || "light");

  // Developer mode
  const [devMode, setDevMode] = useState(localStorage.getItem("wb_devMode") === "true");

  // DNS Settings
  const [dnsPrimary, setDnsPrimary] = useState(localStorage.getItem("wb_dns_primary") || "8.8.8.8");
  const [dnsSecondary, setDnsSecondary] = useState(localStorage.getItem("wb_dns_secondary") || "1.1.1.1");

  // Update Settings
  const [versions, setVersions] = useState([]);
  const [currentVersion, setCurrentVersion] = useState(localStorage.getItem("wb_version") || "1.0.0");

  // Handle Wallpaper
  const handleWallpaperChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalWallpaper(url);
    setWallpaper(url);
    localStorage.setItem("wb_wallpaper", url);
  };

  // Handle Theme
  const handleThemeChange = (e) => {
    const newTheme = e.target.value;
    setLocalTheme(newTheme);
    setTheme(newTheme);
    localStorage.setItem("wb_theme", newTheme);
  };

  // Handle Dev Mode
  const toggleDevMode = () => {
    const newVal = !devMode;
    setDevMode(newVal);
    localStorage.setItem("wb_devMode", newVal);
  };

  // Handle DNS save
  const saveDns = () => {
    localStorage.setItem("wb_dns_primary", dnsPrimary);
    localStorage.setItem("wb_dns_secondary", dnsSecondary);
    alert("✅ DNS settings saved.");
  };

  // Handle version change
  const handleVersionChange = (v) => {
    setCurrentVersion(v);
    localStorage.setItem("wb_version", v);
    alert(`🔁 Web Bro OS downgraded/upgraded to version ${v}`);
  };

  // Handle creating new drive
  const handleCreateDrive = () => {
    const name = prompt("Enter drive letter (e.g., D, E):");
    if (!name) return;
    createDrive(name.toUpperCase());
    alert(`💾 Drive ${name.toUpperCase()}: created.`);
  };

  useEffect(() => {
    if (wallpaper) setWallpaper(wallpaper);
    if (theme) setTheme(theme);

    // Fetch beta versions if available
    fetch("/betas/")
      .then((res) => res.text())
      .then((text) => {
        const matches = [...text.matchAll(/href="([^"]+)"/g)]
          .map((m) => m[1])
          .filter((f) => f.endsWith(".zip") || f.endsWith(".json") || f.endsWith(".html"));
        setVersions(matches);
      })
      .catch(() => setVersions([]));
  }, []);

  return (
    <div className="text-white p-4 space-y-6">
      <h2 className="text-2xl font-semibold mb-2">⚙️ Settings</h2>

      {/* ===== GENERAL SETTINGS ===== */}
      <section>
        <h3 className="text-lg font-bold mb-2">🎨 Appearance</h3>
        <div className="mb-4">
          <label className="block mb-1">Change Wallpaper:</label>
          <input type="file" accept="image/*" onChange={handleWallpaperChange} />
          {wallpaper && (
            <img src={wallpaper} alt="Wallpaper preview" className="mt-2 w-48 h-28 object-cover rounded" />
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Select Theme:</label>
          <select
            value={theme}
            onChange={handleThemeChange}
            className="bg-gray-800 text-white p-1 rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="blue">Blue</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </section>

      {/* ===== DEVELOPER SETTINGS ===== */}
      <section>
        <h3 className="text-lg font-bold mb-2">💻 Developer Settings</h3>
        <div className="flex items-center gap-2 mb-2">
          <input type="checkbox" checked={devMode} onChange={toggleDevMode} />
          <label>Enable Developer Mode</label>
        </div>
        {devMode && (
          <div className="text-sm text-gray-400">
            <p>OS Version: {currentVersion}</p>
            <p>Build Type: Developer</p>
            <p>System Store Active: ✅</p>
          </div>
        )}
      </section>

      {/* ===== NETWORK SETTINGS ===== */}
      <section>
        <h3 className="text-lg font-bold mb-2">🌐 Network (DNS)</h3>
        <div className="mb-2">
          <label className="block">Primary DNS:</label>
          <input
            type="text"
            value={dnsPrimary}
            onChange={(e) => setDnsPrimary(e.target.value)}
            className="bg-gray-800 text-white p-1 rounded w-40"
          />
        </div>
        <div className="mb-2">
          <label className="block">Secondary DNS:</label>
          <input
            type="text"
            value={dnsSecondary}
            onChange={(e) => setDnsSecondary(e.target.value)}
            className="bg-gray-800 text-white p-1 rounded w-40"
          />
        </div>
        <button
          onClick={saveDns}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
        >
          Save DNS Settings
        </button>
      </section>

      {/* ===== UPDATE SETTINGS ===== */}
      <section>
        <h3 className="text-lg font-bold mb-2">🧩 Update Settings</h3>
        <p className="text-gray-400 text-sm mb-2">
          Current version: <strong>{currentVersion}</strong>
        </p>
        {versions.length > 0 ? (
          <div className="space-y-2">
            {versions.map((v) => (
              <div key={v} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span>{v}</span>
                <button
                  onClick={() => handleVersionChange(v)}
                  className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-sm"
                >
                  Install
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No beta versions found. (Ensure /public/betas exists)</p>
        )}
      </section>

      {/* ===== DRIVE MANAGEMENT (TASK MANAGER STYLE) ===== */}
      <section>
        <h3 className="text-lg font-bold mb-2">💾 Drive Management</h3>
        <button
          onClick={handleCreateDrive}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded mb-2"
        >
          ➕ Create New Drive
        </button>

        {Object.keys(drives).length > 0 ? (
          <div className="space-y-1">
            {Object.keys(drives).map((d) => (
              <div key={d} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                <span>Drive {d}:</span>
                <span>{drives[d].length} items</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No drives available.</p>
        )}
      </section>
    </div>
  );
}
