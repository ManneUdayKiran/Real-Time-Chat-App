import React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import anime from "animejs";
import io from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_URL); // Adjust the URL as needed
import {
  Flex,
  Splitter,
  Typography,
  List,
  Avatar,
  Input,
  ConfigProvider,
  theme,
} from "antd";
import Navbar from "./Navbar";
import "../App.css"; // Assuming you have some styles in App.css
import EmojiPicker from "emoji-picker-react"; // ✅ Import the picker
import { SmileOutlined, SendOutlined, SearchOutlined } from "@ant-design/icons"; // AntD icon for emoji button
import { Dropdown, Menu, message as antdMsg, Button, Tooltip } from "antd";
import {
  MoreOutlined,
  DeleteOutlined,
  ExportOutlined,
  ClearOutlined,
} from "@ant-design/icons";
import { Modal } from "antd"; // For confirmation dialogs
import ImageUpload from "./ImageUpload"; // ✅ Import the image upload component
import { Image } from "antd";

// Gradient Colors for avatars
const GradientColors = [
  "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
  "linear-gradient(135deg, #14b8a6 0%, #22d3d8 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
  "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
];

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const userListRef = useRef(null);
  const chatPanelRef = useRef(null);
  const messageRefs = useRef([]);

  const [currentUser, setCurrentUser] = useState(null);

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  // Animate messages on load
  const animateNewMessage = useCallback((index) => {
    setTimeout(() => {
      const messageEl = document.querySelector(
        `[data-message-index="${index}"]`
      );
      if (messageEl) {
        anime({
          targets: messageEl,
          translateY: [20, 0],
          opacity: [0, 1],
          scale: [0.9, 1],
          duration: 400,
          easing: "easeOutExpo",
        });
      }
    }, 50);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // Animate the latest message
    if (messages.length > 0) {
      animateNewMessage(messages.length - 1);
    }
  }, [messages, animateNewMessage]);

  // Initial animations
  useEffect(() => {
    // Animate user list
    anime({
      targets: userListRef.current,
      translateX: [-50, 0],
      opacity: [0, 1],
      duration: 600,
      easing: "easeOutExpo",
      delay: 200,
    });
  }, []);

  // Animate when selecting a user
  useEffect(() => {
    if (selectedUser && chatPanelRef.current) {
      anime({
        targets: chatPanelRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: "easeOutExpo",
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (currentUser) {
      socket.emit("user_connected", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on("online_users", (userList) => {
      setOnlineUsers(userList);
    });
    return () => socket.off("online_users");
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) {
      alert("Unauthorized. Redirecting to login...");
      window.location.href = "/";
    } else {
      setCurrentUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        const filtered = data.filter((u) => u.username !== currentUser);
        setUsers(filtered);

        // Animate user list items
        setTimeout(() => {
          anime({
            targets: ".user-list-item",
            translateX: [-30, 0],
            opacity: [0, 1],
            delay: anime.stagger(80),
            duration: 500,
            easing: "easeOutExpo",
          });
        }, 300);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
        alert("Session expired or unauthorized. Please log in again.");
        window.location.href = "/";
      }
    };

    fetchUsers();
  }, [currentUser]);

  const fetchConversation = async (selected) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/messages/${currentUser}/${selected}`
      );
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("❌ Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    const handleReceive = (data) => {
      const { from, to } = data;
      if (
        (from === currentUser && to === selectedUser) ||
        (from === selectedUser && to === currentUser)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [selectedUser, currentUser]);

  useEffect(() => {
    const handleTyping = ({ from, to }) => {
      if (!currentUser || !selectedUser) return;
      if (to === currentUser && from === selectedUser) {
        setTypingUser(from);
      }
    };

    const handleStopTyping = ({ from, to }) => {
      if (to === currentUser && from === selectedUser) {
        setTypingUser(null);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [selectedUser, currentUser]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg = {
      from: currentUser,
      to: selectedUser,
      text: newMessage,
    };

    socket.emit("send_message", msg);
    setNewMessage("");
    socket.emit("stop_typing", { from: currentUser, to: selectedUser });
    setShowEmojiPicker(false);
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    socket.emit("typing", { from: currentUser, to: selectedUser });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { from: currentUser, to: selectedUser });
    }, 1000);
  };

  const handleDelete = async (id) => {
    console.log("Trying to delete message with ID:", id);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/messages/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      console.log("🔁 Response:", res.status, data);

      if (!res.ok) throw new Error("Failed to delete");

      // Animate message removal
      const messageEl = document.querySelector(`[data-message-id="${id}"]`);
      if (messageEl) {
        anime({
          targets: messageEl,
          translateX: 100,
          opacity: 0,
          duration: 300,
          easing: "easeInExpo",
          complete: () => {
            setMessages((prev) => prev.filter((msg) => msg._id !== id));
          },
        });
      } else {
        setMessages((prev) => prev.filter((msg) => msg._id !== id));
      }
      antdMsg.success("Message deleted");
    } catch (err) {
      console.error("❌ Delete failed:", err);
      antdMsg.error("Delete failed");
    }
  };

  const handleClear = async () => {
    Modal.confirm({
      title: "Clear all messages?",
      content: "This action cannot be undone.",
      okText: "Clear",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const res = await fetch(
            `${
              import.meta.env.VITE_API_BASE_URL
            }/api/messages/${currentUser}/${selectedUser}`,
            {
              method: "DELETE",
            }
          );

          const data = await res.json();
          console.log("🧹 Messages cleared:", data);

          // Animate all messages out
          anime({
            targets: ".message-item",
            translateY: -30,
            opacity: 0,
            delay: anime.stagger(30),
            duration: 300,
            easing: "easeInExpo",
            complete: () => setMessages([]),
          });
        } catch (err) {
          console.error("❌ Clear failed:", err);
        }
      },
    });
  };

  const handleExport = () => {
    const data = messages
      .map(({ text, from, to }) => `${from} to ${to}: ${text}`)
      .join("\n");
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat_${selectedUser}.txt`;
    link.click();
    antdMsg.success("Chat exported successfully!");
  };

  const selectedUserIndex = users.findIndex((u) => u.username === selectedUser);
  const avatarGradient =
    GradientColors[selectedUserIndex % GradientColors.length] ||
    GradientColors[0];

  const handleImageSend = (url) => {
    const msg = {
      from: currentUser,
      to: selectedUser,
      imageUrl: url,
    };
    socket.emit("send_message", msg);
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 12,
        },
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
      >
        <Navbar currentUser={localStorage.getItem("currentUser")} />

        <Splitter style={{ height: "calc(100vh - 70px)" }}>
          {/* Left Panel - User List */}
          <Splitter.Panel
            defaultSize="320px"
            min="280px"
            max="400px"
            style={{
              background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
              borderRight: "1px solid rgba(0, 0, 0, 0.06)",
            }}
          >
            <div
              ref={userListRef}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                opacity: 0,
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "20px 20px 16px",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                }}
              >
                <Typography.Title
                  level={4}
                  style={{
                    margin: 0,
                    marginBottom: 16,
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Messages
                </Typography.Title>

                {/* Search Input */}
                <Input
                  placeholder="Search conversations..."
                  prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    borderRadius: 12,
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    background: "#f1f5f9",
                    padding: "10px 14px",
                  }}
                />
              </div>

              {/* User List */}
              <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
                <List
                  dataSource={filteredUsers}
                  renderItem={(user, index) => {
                    const gradient =
                      GradientColors[index % GradientColors.length];
                    const isOnline = onlineUsers.includes(user.username);
                    const isSelected = selectedUser === user.username;

                    return (
                      <List.Item
                        className="user-list-item"
                        onClick={() => setSelectedUser(user.username)}
                        style={{
                          cursor: "pointer",
                          padding: "12px 16px",
                          marginBottom: 8,
                          borderRadius: 16,
                          border: isSelected
                            ? "2px solid #6366f1"
                            : "1px solid transparent",
                          background: isSelected
                            ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
                            : "rgba(255, 255, 255, 0.8)",
                          boxShadow: isSelected
                            ? "0 4px 16px rgba(99, 102, 241, 0.15)"
                            : "0 2px 8px rgba(0, 0, 0, 0.04)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          opacity: 0,
                        }}
                      >
                        <List.Item.Meta
                          avatar={
                            <div style={{ position: "relative" }}>
                              <Avatar
                                size={48}
                                style={{
                                  background: gradient,
                                  fontSize: 18,
                                  fontWeight: 600,
                                  border: "2px solid white",
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                {user.username[0].toUpperCase()}
                              </Avatar>
                              {isOnline && (
                                <span
                                  style={{
                                    position: "absolute",
                                    bottom: 2,
                                    right: 2,
                                    width: 14,
                                    height: 14,
                                    background: "#22c55e",
                                    border: "2px solid white",
                                    borderRadius: "50%",
                                    boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
                                  }}
                                />
                              )}
                            </div>
                          }
                          title={
                            <Typography.Text
                              style={{
                                fontWeight: 600,
                                fontSize: 15,
                                color: "#1e293b",
                              }}
                            >
                              {user.username}
                            </Typography.Text>
                          }
                          description={
                            <Typography.Text
                              style={{
                                fontSize: 13,
                                color: isOnline ? "#22c55e" : "#94a3b8",
                              }}
                            >
                              {isOnline ? "● Online" : "○ Offline"}
                            </Typography.Text>
                          }
                        />
                      </List.Item>
                    );
                  }}
                />
              </div>
            </div>
          </Splitter.Panel>

          {/* Right Panel - Chat */}
          <Splitter.Panel
            style={{
              display: "flex",
              flexDirection: "column",
              background: "#ffffff",
            }}
          >
            {selectedUser ? (
              <div
                ref={chatPanelRef}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Chat Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "16px 24px",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
                    background: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <Avatar
                      size={50}
                      style={{
                        background: avatarGradient,
                        fontSize: 20,
                        fontWeight: 600,
                        border: "2px solid white",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {selectedUser[0].toUpperCase()}
                    </Avatar>
                    {onlineUsers.includes(selectedUser) && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 2,
                          right: 2,
                          width: 14,
                          height: 14,
                          background: "#22c55e",
                          border: "2px solid white",
                          borderRadius: "50%",
                          boxShadow: "0 0 8px rgba(34, 197, 94, 0.6)",
                        }}
                      />
                    )}
                  </div>

                  <div style={{ flex: 1, marginLeft: 16 }}>
                    <Typography.Title
                      level={5}
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      {selectedUser}
                    </Typography.Title>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 4,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: onlineUsers.includes(selectedUser)
                          ? "rgba(34, 197, 94, 0.1)"
                          : "rgba(148, 163, 184, 0.1)",
                        fontSize: 12,
                        fontWeight: 500,
                        color: onlineUsers.includes(selectedUser)
                          ? "#16a34a"
                          : "#64748b",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: onlineUsers.includes(selectedUser)
                            ? "#22c55e"
                            : "#94a3b8",
                        }}
                      />
                      {onlineUsers.includes(selectedUser)
                        ? "Online"
                        : "Offline"}
                    </div>
                  </div>

                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: "export",
                          label: "Export Chat",
                          icon: <ExportOutlined />,
                        },
                        { type: "divider" },
                        {
                          key: "clear",
                          label: "Clear Messages",
                          icon: <ClearOutlined />,
                          danger: true,
                        },
                      ],
                      onClick: ({ key }) => {
                        if (key === "clear") handleClear();
                        if (key === "export") handleExport();
                      },
                    }}
                    placement="bottomRight"
                  >
                    <Button
                      icon={<MoreOutlined />}
                      type="text"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    />
                  </Dropdown>
                </div>

                {/* Messages Area */}
                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px 24px",
                    background:
                      "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
                  }}
                >
                  {messages.map((msg, index) => {
                    const isSender = msg.from === currentUser;
                    const userIndex = users.findIndex(
                      (u) => u.username === msg.from
                    );
                    const gradient =
                      GradientColors[userIndex % GradientColors.length] ||
                      GradientColors[0];

                    return (
                      <div
                        key={msg._id}
                        data-message-id={msg._id}
                        data-message-index={index}
                        className="message-item"
                        style={{
                          display: "flex",
                          justifyContent: isSender ? "flex-end" : "flex-start",
                          marginBottom: 16,
                          opacity: 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-end",
                            flexDirection: isSender ? "row-reverse" : "row",
                            gap: 10,
                            maxWidth: "70%",
                          }}
                        >
                          <Avatar
                            size={36}
                            style={{
                              background: gradient,
                              fontSize: 14,
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {msg.from[0].toUpperCase()}
                          </Avatar>

                          <div
                            style={{
                              padding: "12px 18px",
                              borderRadius: 20,
                              borderBottomRightRadius: isSender ? 6 : 20,
                              borderBottomLeftRadius: isSender ? 20 : 6,
                              background: isSender
                                ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                                : "#ffffff",
                              color: isSender ? "white" : "#1e293b",
                              boxShadow: isSender
                                ? "0 4px 16px rgba(99, 102, 241, 0.3)"
                                : "0 2px 12px rgba(0, 0, 0, 0.08)",
                              border: isSender
                                ? "none"
                                : "1px solid rgba(0, 0, 0, 0.05)",
                            }}
                          >
                            {msg.text && (
                              <span style={{ fontSize: 15, lineHeight: 1.5 }}>
                                {msg.text}
                              </span>
                            )}
                            {msg.imageUrl && (
                              <Image
                                src={msg.imageUrl}
                                alt="chat-image"
                                width={280}
                                style={{
                                  marginTop: msg.text ? 8 : 0,
                                  borderRadius: 12,
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                }}
                              />
                            )}
                          </div>

                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: "delete",
                                  label: "Delete",
                                  icon: <DeleteOutlined />,
                                  danger: true,
                                  onClick: () => handleDelete(msg._id),
                                },
                              ],
                            }}
                            placement={isSender ? "bottomLeft" : "bottomRight"}
                            trigger={["click"]}
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<MoreOutlined />}
                              style={{
                                opacity: 0.5,
                                transition: "opacity 0.2s",
                              }}
                            />
                          </Dropdown>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef}></div>
                </div>

                {/* Typing Indicator */}
                {typingUser && selectedUser && typingUser === selectedUser && (
                  <div
                    style={{
                      padding: "8px 24px",
                      background: "#ffffff",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "10px 16px",
                        background: "rgba(99, 102, 241, 0.1)",
                        borderRadius: 20,
                      }}
                    >
                      <div
                        className="typing-dot"
                        style={{ animationDelay: "0s" }}
                      />
                      <div
                        className="typing-dot"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="typing-dot"
                        style={{ animationDelay: "0.4s" }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          color: "#6366f1",
                          marginLeft: 4,
                        }}
                      >
                        {typingUser} is typing...
                      </span>
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div
                  style={{
                    padding: "16px 24px",
                    background: "#ffffff",
                    borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "#f8fafc",
                      borderRadius: 24,
                      padding: "8px 16px",
                      border: "1px solid rgba(0, 0, 0, 0.06)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Tooltip title="Emoji">
                      <Button
                        type="text"
                        icon={
                          <SmileOutlined
                            style={{ fontSize: 22, color: "#6366f1" }}
                          />
                        }
                        onClick={() => setShowEmojiPicker((prev) => !prev)}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </Tooltip>

                    {showEmojiPicker && (
                      <div className="emoji-picker-container">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}

                    <ImageUpload onUploadSuccess={handleImageSend} />

                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={handleTyping}
                      onPressEnter={handleSend}
                      bordered={false}
                      style={{
                        flex: 1,
                        fontSize: 15,
                        background: "transparent",
                      }}
                    />

                    <Button
                      type="primary"
                      icon={<SendOutlined style={{ fontSize: 18 }} />}
                      onClick={handleSend}
                      disabled={!newMessage.trim()}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        background: newMessage.trim()
                          ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                          : "#e2e8f0",
                        border: "none",
                        boxShadow: newMessage.trim()
                          ? "0 4px 16px rgba(99, 102, 241, 0.4)"
                          : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Empty State
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
                  padding: 40,
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 30,
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
                  }}
                >
                  <SendOutlined style={{ fontSize: 50, color: "white" }} />
                </div>
                <Typography.Title
                  level={3}
                  style={{
                    margin: 0,
                    marginBottom: 8,
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >
                  Start a Conversation
                </Typography.Title>
                <Typography.Text
                  style={{
                    color: "#64748b",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  Select a user from the sidebar to begin chatting
                </Typography.Text>
              </div>
            )}
          </Splitter.Panel>
        </Splitter>
      </div>
    </ConfigProvider>
  );
};

export default Chat;
