import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('currentUser', res.data.username);
      window.location.href = '/chat';
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setErrorMessage(msg);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Card elevation={6} sx={{ width: '100%', p: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom align="center">
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                type="password"
                margin="normal"
                label="Password"
                variant="outlined"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errorMessage && (
                <Typography
                  variant="body2"
                  color="error"
                  sx={{
                    my: 2,
                    p: 1.5,
                    border: '1px solid red',
                    borderRadius: '4px',
                    backgroundColor: '#ffe6e6',
                  }}
                >
                  {errorMessage}
                </Typography>
              )}
              <Button fullWidth type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Login
              </Button>
            </form>
            <Typography variant="body2" mt={3} align="center">
              Don't have an account? <Link to="/register">Register here</Link>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
