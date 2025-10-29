import React, { useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import Cursor from "./components/Cursor";
import Search from "./components/Search";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Explore from "./components/Explore"; // new
import PublicEditor from "./components/PublicEditor";
import UpdateSubscribe from "./components/SubscribePrompt";
import "./index.css";

import wallpaper1 from "./assets/images/wallpaper1.jpg";
import wallpaper2 from "./assets/images/wallpaper2.jpg";
import wallpaper3 from "./assets/images/wallpaper3.jpg";

export default function App() {
  const [bootFinished, setBootFinished] = useState(false);
  const [user, setUser] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [selectedWallpaper, setSelectedWallpaper] = useState(wallpaper1);
  const [showExplore, setShowExplore] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const wallpapers = [wallpaper1, wallpaper2, wallpaper3];

  const handleLoginOrRegister = (loggedUser) => {
    setUser(loggedUser);
    setBootFinished(true); // after RegisterForm finishes
  };

  // Login/Register screen
  if (!user && !activeForm) {
    return (
      <div style={{ textAlign:"center", marginTop:50 }}>
        <h2>Welcome to WebBro OS</h2>
        <div style={{ marginTop:20 }}>
          <button onClick={()=>setActiveForm("register")}>Register</button>
          <button onClick={()=>setActiveForm("login")}>Login</button>
        </div>
      </div>
    );
  }

  // Wallpaper selection
  if (user && !bootFinished) {
    return (
      <div style={{ textAlign:"center", marginTop:50 }}>
        <h2>Select Your Wallpaper</h2>
        <div style={{ display:"flex", justifyContent:"center", marginTop:20, gap:20 }}>
          {wallpapers.map((wp, idx) => (
            <img key={idx} src={wp} alt={`wp-${idx}`} style={{ width:150, height:100, cursor:"pointer", border:selectedWallpaper===wp?"3px solid #0078D7":"2px solid #ccc", borderRadius:6 }} onClick={()=>setSelectedWallpaper(wp)}/>
          ))}
        </div>
        <button onClick={()=>setBootFinished(true)} style={{ marginTop:20 }}>Confirm</button>
      </div>
    );
  }

  return (
    <>
      {!user && activeForm==="register" && <RegisterForm onRegister={handleLoginOrRegister} />}
      {!user && activeForm==="login" && <LoginForm onLogin={handleLoginOrRegister} />}

      {user && bootFinished && (
        <>
          <Desktop
            wallpaper={selectedWallpaper}
            onOpenExplorer={()=>setExplorerOpen(true)}
            onOpenEditor={()=>setEditorOpen(true)}
            onOpenExplore={()=>setShowExplore(true)}
          />
          <Cursor />
          {searchOpen && <Search />}
          {explorerOpen && <PublicEditor user={user} onClose={()=>setExplorerOpen(false)}/>}
          {editorOpen && <PublicEditor user={user} onClose={()=>setEditorOpen(false)}/>}

          {showExplore && <Explore user={user} onClose={()=>setShowExplore(false)} />}

          <div style={{ position:"fixed", bottom:20, right:20, zIndex:999 }}>
            <UpdateSubscribe />
          </div>
        </>
      )}
    </>
  );
}
