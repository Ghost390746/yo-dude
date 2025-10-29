import React from "react";
import Page1 from "@react-login-page/page1";
import { motion } from "framer-motion";

export default function LoginScreen({ setLoggedIn }) {
  const handleLogin = (e) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  return (
    <motion.div
      className="w-screen h-screen flex items-center justify-center bg-[url('/wallpapers/login.jpg')] bg-cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleLogin}>
        <div className="scale-110">
          <Page1
            logo="https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2021.svg"
            title="Welcome Back"
            usernamePlaceholder="Username"
            passwordPlaceholder="Password"
            buttonLabel="Sign In"
          />
        </div>
      </form>
    </motion.div>
  );
}
