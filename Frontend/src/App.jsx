import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./components/Chat";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";
import React, { useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Optional: Check system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mediaQuery.matches);
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <ConfigProvider
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#6366f1",
            borderRadius: 12,
            fontFamily:
              '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </ThemeProvider>
  );
}

export default App;
