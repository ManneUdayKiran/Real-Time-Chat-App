import React, { useEffect, useRef } from "react";
import anime from "animejs";
import { Layout, Avatar, Dropdown, Typography, Space } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  MessageOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const Navbar = ({ currentUser }) => {
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const userRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // Navbar slide down animation
    anime({
      targets: navRef.current,
      translateY: [-60, 0],
      opacity: [0, 1],
      duration: 800,
      easing: "easeOutExpo",
    });

    // Logo bounce animation
    anime({
      targets: logoRef.current,
      scale: [0, 1],
      rotate: ["-15deg", "0deg"],
      duration: 600,
      delay: 300,
      easing: "easeOutBack",
    });

    // Animate title letters with subtle floating effect
    if (titleRef.current) {
      const letters = titleRef.current.querySelectorAll(".title-letter");

      // Subtle continuous floating animation
      anime({
        targets: letters,
        translateY: [-2, 2],
        duration: 2000,
        delay: anime.stagger(100),
        direction: "alternate",
        loop: true,
        easing: "easeInOutSine",
      });
    }

    // User section fade in
    anime({
      targets: userRef.current,
      translateX: [30, 0],
      opacity: [0, 1],
      duration: 600,
      delay: 500,
      easing: "easeOutExpo",
    });
  }, []);

  const handleLogout = () => {
    // Logout animation
    anime({
      targets: navRef.current,
      translateY: [0, -60],
      opacity: [1, 0],
      duration: 400,
      easing: "easeInExpo",
      complete: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        window.location.href = "/";
      },
    });
  };

  const items = [
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Sign Out",
      icon: <LogoutOutlined style={{ color: "#ef4444" }} />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Header
      ref={navRef}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        padding: "0 24px",
        height: 70,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Logo Section */}
      <div
        ref={logoRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
          }}
        >
          <MessageOutlined style={{ fontSize: 22, color: "white" }} />
        </div>
        <Typography.Title
          level={4}
          ref={titleRef}
          style={{
            color: "#ffffff",
            margin: 0,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {/* Animated title letters */}
          {"Real-Time".split("").map((letter, i) => (
            <span
              key={`rt-${i}`}
              className="title-letter"
              style={{
                color: "#a5b4fc",
                display: "inline-block",
              }}
            >
              {letter}
            </span>
          ))}
          <span style={{ width: "8px", display: "inline-block" }}>&nbsp;</span>
          {"Chat".split("").map((letter, i) => (
            <span
              key={`chat-${i}`}
              className="title-letter"
              style={{
                color: "#ffffff",
                display: "inline-block",
              }}
            >
              {letter}
            </span>
          ))}
          <span style={{ width: "8px", display: "inline-block" }}>&nbsp;</span>
          {"App".split("").map((letter, i) => (
            <span
              key={`app-${i}`}
              className="title-letter"
              style={{
                color: "#ffffff",
                display: "inline-block",
              }}
            >
              {letter}
            </span>
          ))}
        </Typography.Title>
      </div>

      {/* User Section */}
      <div ref={userRef}>
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          trigger={["click"]}
          overlayStyle={{
            minWidth: 180,
          }}
        >
          <Space
            style={{
              cursor: "pointer",
              padding: "8px 16px",
              borderRadius: 12,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "all 0.3s ease",
            }}
            className="user-dropdown-trigger"
          >
            <Avatar
              size={38}
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                fontWeight: 600,
              }}
            >
              {currentUser?.[0]?.toUpperCase() || <UserOutlined />}
            </Avatar>
            <div style={{ textAlign: "left", marginLeft: 8 }}>
              <Typography.Text
                style={{
                  color: "white",
                  fontWeight: 600,
                  display: "block",
                  lineHeight: 1.4,
                  fontSize: 14,
                }}
              >
                {currentUser}
              </Typography.Text>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
                    display: "inline-block",
                  }}
                />
                <Typography.Text
                  style={{
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: 12,
                  }}
                >
                  Online
                </Typography.Text>
              </div>
            </div>
          </Space>
        </Dropdown>
      </div>

      <style>{`
        .user-dropdown-trigger:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-1px);
        }
        .ant-dropdown-menu {
          border-radius: 12px !important;
          padding: 8px !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
        }
        .ant-dropdown-menu-item {
          border-radius: 8px !important;
          margin: 2px 0 !important;
        }
      `}</style>
    </Header>
  );
};

export default Navbar;
