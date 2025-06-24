import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
// import Chat from './pages/Chat'; // Optional
import Chat from './components/Chat'; // Importing Chat component
import { Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, IconButton } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import React, { useState } from 'react';


function App() {
  const [darkMode, setDarkMode] = useState(false);


  const toggleDark = () => setDarkMode((prev) => !prev);
  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      {/* <CssBaseline />
      <IconButton onClick={toggleDark} sx={{ position: 'absolute', top: 8, right: 800 }}>
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton> */}
      {/* Your routes/components here */}
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/chat" element={<Chat />} />


      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
