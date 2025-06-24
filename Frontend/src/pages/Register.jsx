import axios from 'axios';
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { Input } from 'antd';
import Lottie from 'lottie-react';
// import registerAnimation from '../assets/register.json';
import { Link } from 'react-router-dom';


const Register = () => {
    const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


const handleRegister = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post('https://real-time-chat-app-tgy9.onrender.com/api/auth/register', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Registration Success:', res.data);

    // Optionally store token
    localStorage.setItem('token', res.data.token);

    // Redirect to chat page or login
    window.location.href = '/chat';
  } catch (err) {
   const msg = err.response?.data?.message || 'Registration failed';
  setErrorMessage(msg); // ✅ set error state
  }
};

  return (
    <Container width='sm' maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        {/* <Box width="80%" maxWidth="300px">
          <Lottie animationData={registerAnimation} loop />
        </Box> */}
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleRegister} style={{ width: '100%' }}>
          <TextField
            fullWidth
            margin="normal"
            name="username"
            label="Username"
            variant="outlined"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
          />
          <Input.Password
            name="password"
            placeholder="Password"
            style={{ width: '100%', margin: '16px 0' }}
            onChange={handleChange}
          />
          {errorMessage && (
  <Typography className='p-3 rounded' style={{border:'1px solid red'}} variant="body2" color="error" sx={{ my: 2 }}>
    {errorMessage}
  </Typography>
)}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
          >
            Register
          </Button>
        </form>
        <Typography variant="body2" mt={2}>
          Already have an account? <Link to="/">Login here</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;
