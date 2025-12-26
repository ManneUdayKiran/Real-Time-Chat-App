import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import anime from "animejs";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonAddOutlined,
  PersonOutline,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from "../theme";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const cardRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const bubbleRefs = useRef([]);

  useEffect(() => {
    // Animate floating shapes
    bubbleRefs.current.forEach((bubble, index) => {
      anime({
        targets: bubble,
        translateY: [-15, 15],
        translateX: [-8, 8],
        rotate: [0, 10, -10, 0],
        scale: [0.95, 1.05],
        opacity: [0.4, 0.8],
        duration: 4000 + index * 600,
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine",
        delay: index * 300,
      });
    });

    // Card entrance animation
    anime({
      targets: cardRef.current,
      translateY: [60, 0],
      opacity: [0, 1],
      scale: [0.85, 1],
      duration: 900,
      easing: "easeOutExpo",
    });

    // Title animation
    anime({
      targets: titleRef.current,
      translateY: [-30, 0],
      opacity: [0, 1],
      duration: 700,
      delay: 350,
      easing: "easeOutExpo",
    });

    // Form fields stagger animation
    anime({
      targets: formRef.current?.querySelectorAll(".form-field"),
      translateX: [-50, 0],
      opacity: [0, 1],
      duration: 700,
      delay: anime.stagger(120, { start: 550 }),
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Registration Success:", res.data);

      // Success animation
      anime({
        targets: cardRef.current,
        scale: [1, 1.03, 1],
        duration: 350,
        easing: "easeInOutQuad",
        complete: () => {
          localStorage.setItem("token", res.data.token);
          window.location.href = "/chat";
        },
      });
    } catch (err) {
      setLoading(false);
      const msg = err.response?.data?.message || "Registration failed";
      setErrorMessage(msg);

      // Shake animation on error
      anime({
        targets: cardRef.current,
        translateX: [-12, 12, -12, 12, 0],
        duration: 450,
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
            "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Shapes */}
        {[...Array(7)].map((_, i) => (
          <Box
            key={i}
            ref={(el) => (bubbleRefs.current[i] = el)}
            sx={{
              position: "absolute",
              borderRadius: i % 2 === 0 ? "50%" : "30%",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              width: [70, 100, 50, 130, 90, 60, 110][i],
              height: [70, 100, 50, 130, 90, 60, 110][i],
              top: ["15%", "55%", "25%", "75%", "10%", "65%", "40%"][i],
              left: ["5%", "85%", "75%", "15%", "45%", "55%", "25%"][i],
              opacity: 0,
              transform: i % 2 === 0 ? "rotate(0deg)" : "rotate(45deg)",
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
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.2)",
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
                      "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)",
                  }}
                >
                  <PersonAddOutlined sx={{ fontSize: 35, color: "white" }} />
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
                    "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  opacity: 0,
                }}
              >
                Create Account
              </Typography>

              <Typography
                variant="body2"
                align="center"
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Join us and start chatting today
              </Typography>

              <form ref={formRef} onSubmit={handleRegister}>
                <Box className="form-field" sx={{ opacity: 0 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="username"
                    label="Username"
                    variant="outlined"
                    value={formData.username}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline sx={{ color: "#8b5cf6" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1 }}
                  />
                </Box>

                <Box className="form-field" sx={{ opacity: 0 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="email"
                    label="Email Address"
                    variant="outlined"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined sx={{ color: "#8b5cf6" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 1 }}
                  />
                </Box>

                <Box className="form-field" sx={{ opacity: 0 }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="password"
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ color: "#8b5cf6" }} />
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
                        "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                      boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
                        boxShadow: "0 12px 32px rgba(139, 92, 246, 0.5)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Box>
              </form>

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 4, color: "text.secondary" }}
              >
                Already have an account?{" "}
                <Link
                  to="/"
                  style={{
                    color: "#8b5cf6",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Register;
