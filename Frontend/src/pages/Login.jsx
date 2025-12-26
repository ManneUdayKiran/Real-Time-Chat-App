import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import anime from "animejs";
import {
  Button,
  Container,
  Typography,
  Box,
  TextField,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  ChatBubbleOutline,
  LockOutlined,
  EmailOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "../theme";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const bubbleRefs = useRef([]);

  useEffect(() => {
    // Animate floating bubbles
    bubbleRefs.current.forEach((bubble, index) => {
      anime({
        targets: bubble,
        translateY: [-20, 20],
        translateX: [-10, 10],
        scale: [0.9, 1.1],
        opacity: [0.3, 0.7],
        duration: 3000 + index * 500,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine",
        delay: index * 200,
      });
    });

    // Card entrance animation
    anime({
      targets: cardRef.current,
      translateY: [50, 0],
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 800,
      easing: "easeOutExpo",
    });

    // Title animation
    anime({
      targets: titleRef.current,
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 600,
      delay: 300,
      easing: "easeOutExpo",
    });

    // Form fields stagger animation
    anime({
      targets: formRef.current?.querySelectorAll(".form-field"),
      translateX: [-40, 0],
      opacity: [0, 1],
      duration: 600,
      delay: anime.stagger(100, { start: 500 }),
      easing: "easeOutExpo",
    });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrorMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Success animation
      anime({
        targets: cardRef.current,
        scale: [1, 1.02, 1],
        duration: 300,
        easing: "easeInOutQuad",
        complete: () => {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("currentUser", res.data.username);
          window.location.href = "/chat";
        },
      });
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || "Login failed";
      setErrorMessage(msg);

      // Shake animation on error
      anime({
        targets: cardRef.current,
        translateX: [-10, 10, -10, 10, 0],
        duration: 400,
        easing: "easeInOutQuad",
      });
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6366f1 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Bubbles */}
        {[...Array(6)].map((_, i) => (
          <Box
            key={i}
            ref={(el) => (bubbleRefs.current[i] = el)}
            sx={{
              position: "absolute",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              width: [80, 120, 60, 100, 140, 90][i],
              height: [80, 120, 60, 100, 140, 90][i],
              top: ["10%", "60%", "30%", "70%", "20%", "80%"][i],
              left: ["10%", "80%", "70%", "20%", "50%", "60%"][i],
              opacity: 0,
            }}
          />
        ))}

        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
          <Card
            ref={cardRef}
            elevation={0}
            sx={{
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
              overflow: "visible",
              opacity: 0,
            }}
          >
            <CardContent sx={{ p: 5 }}>
              {/* Logo/Icon */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 30px rgba(99, 102, 241, 0.4)",
                  }}
                >
                  <ChatBubbleOutline sx={{ fontSize: 35, color: "white" }} />
                </Box>
              </Box>

              <Typography
                ref={titleRef}
                variant="h4"
                align="center"
                sx={{
                  mb: 1,
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  opacity: 0,
                }}
              >
                Welcome Back
              </Typography>

              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Sign in to continue your conversations
              </Typography>

              <form ref={formRef} onSubmit={handleLogin}>
                <Box className="form-field" sx={{ opacity: 0 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email Address"
                    variant="outlined"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined sx={{ color: "#6366f1" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </Box>

                <Box className="form-field" sx={{ opacity: 0 }}>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    label="Password"
                    variant="outlined"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ color: "#6366f1" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {errorMessage && (
                  <Box
                    className="form-field"
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <Typography variant="body2" color="error" align="center">
                      {errorMessage}
                    </Typography>
                  </Box>
                )}

                <Box className="form-field" sx={{ opacity: 0 }}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      background:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                      boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                        boxShadow: "0 12px 32px rgba(99, 102, 241, 0.5)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Box>
              </form>

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 4, color: "text.secondary" }}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{
                    color: "#6366f1",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Create one
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
