import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
// import Chat from './pages/Chat'; // Optional
import Chat from './components/Chat'; // Importing Chat component
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './theme';
import React, { useState } from 'react';


function App() {
  const [darkMode, setDarkMode] = useState(false);


  return (
      
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
<Route path="/chat" element={<Chat />} />


      </Routes>
    </Router>
  );
}

export default App;
