import React, { useState, useEffect } from "react";
import Desktop from "./Desktop";
import AppWindow from "./AppWindow";
import Search from "./Search";
import { getCustomApps } from "../utils/storage"; // persistent storage helpers

export default function HomeScreen() {
  const [customApps, setCustomApps] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  // Load saved custom apps from localForage
  useEffect(() => {
    getCustomApps().then((apps) => {
      setCustomApps(apps || []);
    });
  }, []);

  // Combine built-in apps + custom apps for Desktop
  const allApps = [
    // Add built-in apps in Desktop itself
    ...customApps.map((app) => ({
      name: app.name,
      icon: app.icon || "📦",
      component: <div dangerouslySetInnerHTML={{ __html: app.content }} />
    }))
  ];

  return (
    <>
      <Desktop customApps={allApps} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
      {searchOpen && (
        <AppWindow
          title="Search"
          zIndex={customApps.length + 1}
          onClose={() => setSearchOpen(false)}
        >
          <Search />
        </AppWindow>
      )}
    </>
  );
}
