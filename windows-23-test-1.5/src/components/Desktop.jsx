import React, { useState, useEffect } from "react";
import Calculator from "../apps/Calculator";
import Notes from "../apps/Notes";
import Settings from "../apps/Settings";
import FileSystemExplorer from "../apps/Explorer";
import Explore from "../components/Explore";
import PublicEditor from "../components/PublicEditor";
import WebsIDE from "../apps/Webs";
import Search from "./Search";
import AppWindow from "./AppWindow";
import localforage from "localforage";
import { playRandomClickSound } from "../lib/clickSounds"; // ✅ updated import

const builtInApps = [
  { name: "Calculator", icon: "🧮", component: <Calculator /> },
  { name: "Notes", icon: "📝", component: <Notes /> },
  { name: "Settings", icon: "⚙️", component: <Settings /> },
  { name: "Filesystem Explorer", icon: "🗄️", component: <FileSystemExplorer /> },
  { name: "Explore", icon: "🗂️", component: <Explore /> },
  { name: "Public Editor", icon: "🖌️", component: <PublicEditor /> },
  { name: "Webs IDE", icon: "💻", component: <WebsIDE /> },
];

export default function Desktop({ wallpaper, user }) {
  const [openApps, setOpenApps] = useState([]);
  const [customApps, setCustomApps] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    localforage.getItem("customApps").then((apps) => {
      if (apps) setCustomApps(apps);
    });
  }, []);

  const appsList = [...builtInApps, ...customApps];

  const openApp = async (app) => {
    // Play a random click sound asynchronously
    playRandomClickSound();

    let componentToOpen = app.component;
    if (app.name === "Explore" || app.name === "Public Editor") {
      componentToOpen = React.cloneElement(app.component, {
        user,
        onClose: () => closeApp(app.name),
      });
    }

    if (!openApps.some((a) => a.name === app.name)) {
      setOpenApps([...openApps, { ...app, component: componentToOpen }]);
    }
  };

  const closeApp = (appName) => {
    setOpenApps(openApps.filter((a) => a.name !== appName));
  };

  return (
    <div
      className="desktop"
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {/* App Icons */}
      <div
        className="desktop-icons-container"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          padding: "1rem",
          justifyContent: "flex-start",
        }}
      >
        {appsList.map((app) => (
          <div
            key={app.name}
            className="desktop-icon"
            onClick={() => openApp(app)}
            style={{
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              width: "clamp(60px, 8vw, 120px)",
            }}
          >
            <span
              style={{
                fontSize: "clamp(32px, 6vw, 64px)",
                lineHeight: 1,
              }}
            >
              {app.icon}
            </span>
            <div
              style={{
                fontSize: "clamp(12px, 1.5vw, 18px)",
                wordWrap: "break-word",
              }}
            >
              {app.name}
            </div>
          </div>
        ))}
      </div>

      {/* Open Apps */}
      {openApps.map((app, index) => (
        <AppWindow
          key={app.name}
          title={app.name}
          zIndex={index + 1}
          onClose={() => closeApp(app.name)}
          maxWidth="95vw"
          maxHeight="95vh"
          minWidth="300px"
          minHeight="200px"
        >
          {app.component}
        </AppWindow>
      ))}

      {/* Search App */}
      {searchOpen && (
        <AppWindow
          title="Search"
          zIndex={openApps.length + 1}
          onClose={() => setSearchOpen(false)}
          maxWidth="90vw"
          maxHeight="80vh"
        >
          <Search />
        </AppWindow>
      )}
    </div>
  );
}
