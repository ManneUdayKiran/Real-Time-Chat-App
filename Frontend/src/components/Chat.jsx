import React from 'react';
import { useEffect, useState,useRef } from 'react';
import io from 'socket.io-client';
const socket = io('https://real-time-chat-app-tgy9.onrender.com'); // Adjust the URL as needed
import { Flex, Splitter, Typography, List, Avatar, Input } from 'antd';
import Navbar from './Navbar';
import '../App.css'; // Assuming you have some styles in App.css 
import EmojiPicker from 'emoji-picker-react'; // ✅ Import the picker
import { SmileOutlined,SendOutlined } from '@ant-design/icons'; // AntD icon for emoji button
import { Dropdown, Menu, message as antdMsg,Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';
import { Modal } from 'antd'; // For confirmation dialogs
import ImageUpload from './ImageUpload'; // ✅ Import the image upload component
import { Image } from 'antd';

// import Menu from 'antd/es/menu';
const Chat = () => {
//   const [users, setUsers] = useState(['Alice', 'Bob', 'Charlie']);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [users, setUsers] = useState([]);
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const [onlineUsers, setOnlineUsers] = useState([]);
const [file, setFile] = useState(null);
const [isDarkMode, setIsDarkMode] = useState(true); // toggle this for dark/light


const [showEmojiPicker, setShowEmojiPicker] = useState(false);

const handleEmojiClick = (emojiData) => {
  setNewMessage((prev) => prev + emojiData.emoji);
};


const messagesEndRef = useRef(null);

useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages]);


  const typingTimeoutRef = useRef(null);

const [currentUser, setCurrentUser] = useState(null);



useEffect(() => {
  if (currentUser) {
    socket.emit('user_connected', currentUser);
  }
}, [currentUser]);

useEffect(() => {
  socket.on('online_users', (userList) => {
    setOnlineUsers(userList);
  });

  return () => socket.off('online_users');
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
    const token = localStorage.getItem('token'); // JWT from login

    const res = await fetch('https://real-time-chat-app-tgy9.onrender.com/api/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Unauthorized');
    const data = await res.json();

    const filtered = data.filter((u) => u.username !== currentUser);
    setUsers(filtered);
  } catch (err) {
    console.error('❌ Failed to fetch users:', err);
    alert('Session expired or unauthorized. Please log in again.');
    window.location.href = '/'; // optional
  }
};


  fetchUsers();
}, [currentUser]);


  // Fetch chat history between current user and selected user
  const fetchConversation = async (selected) => {
    try {
      const res = await fetch(`https://real-time-chat-app-tgy9.onrender.com/api/messages/${currentUser}/${selected}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('❌ Failed to fetch messages:', err);
    }
  };

  // Fetch conversation when selected user changes
  useEffect(() => {
    if (selectedUser) {
      fetchConversation(selectedUser);
    }
  }, [selectedUser]);

  // Handle incoming messages
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

    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [selectedUser, currentUser]);

  // Typing event listeners
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

    socket.on('typing', handleTyping);
    socket.on('stop_typing', handleStopTyping);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('stop_typing', handleStopTyping);
    };
  }, [selectedUser, currentUser]);

  // Send message
  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg = {
      from: currentUser,
      to: selectedUser,
      text: newMessage
    };
    console.log("Sending message:", {
  from: currentUser,
  to: selectedUser,
  text: newMessage
});


    socket.emit('send_message', msg);
    setNewMessage('');
    socket.emit('stop_typing', { from: currentUser, to: selectedUser });
  };

  // Handle typing event
  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    socket.emit('typing', { from: currentUser, to: selectedUser });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing', { from: currentUser, to: selectedUser });
    }, 1000);
  };





const handleDelete = async (id) => {
  console.log("Trying to delete message with ID:", id);

  try {
    const res = await fetch(`https://real-time-chat-app-tgy9.onrender.com/api/messages/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    console.log('🔁 Response:', res.status, data);

    if (!res.ok) throw new Error('Failed to delete');

    setMessages((prev) => prev.filter((msg) => msg._id !== id)); // ✅ remove from UI
    antdMsg.success('Message deleted');
  } catch (err) {
    console.error('❌ Delete failed:', err);
    antdMsg.error('Delete failed');
  }
};




 const handleClear = async () => {
  try {
    const res = await fetch(`https://real-time-chat-app-tgy9.onrender.com/api/messages/${currentUser}/${selectedUser}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    console.log('🧹 Messages cleared:', data);
    setMessages([]); // clear from UI
  } catch (err) {
    console.error('❌ Clear failed:', err);
  }
};


const handleExport = () => {
  const data = messages.map(({ text, from, to }) => `${from} to ${to}: ${text}`).join('\n');
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `chat_${selectedUser}.txt`;
  link.click();
};

// const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const selectedUserIndex = users.findIndex(u => u.username === selectedUser);
const avatarColor = ColorList[selectedUserIndex % ColorList.length] || '#ccc';
 
const handleImageSend = (url) => {
  const msg = {
    from: currentUser,
    to: selectedUser,
    imageUrl: url,
  };
  socket.emit('send_message', msg);
};



   return (
    <div
    
     >
            <Navbar currentUser={localStorage.getItem('currentUser')} />

    <Splitter style={{ height: '90vh' }}>
      {/* Left Panel - User List */}
      <Splitter.Panel defaultSize="30%" style={{ padding: '1rem', backgroundColor: '#f5f5f5' }}>
        <Typography.Title  style={{borderBottom:' 2px solid  rgba(0,0,0,0.1)',padding:'20px',margin:'0'}} level={4}>Users</Typography.Title>
      
<List
  dataSource={users}
  renderItem={(user, index) => {
    const color = ColorList[index % ColorList.length]; // rotate through colors

    return (
      <List.Item
        className="user-items rounded"
        onClick={() => setSelectedUser(user.username)}
        style={{
          cursor: 'pointer',
          border: '1px solid rgba(0,0,0,0.1)',
          marginTop: '4px',
          transition: '0.3s',
        }}
      >
        <List.Item.Meta
          className="m-1"
          avatar={
            <Avatar style={{ backgroundColor: color }}>
              {user.username[0].toUpperCase()}
            </Avatar>
          }
          title={user.username}
        />
      </List.Item>
    );
  }}
/>


      </Splitter.Panel>
         

      {/* Right Panel - Chat */}
      <Splitter.Panel style={{ padding: '1rem', display: 'flex', flexDirection: 'column',backgroundColor: '#f5f5f5'}}>
        {/* <Typography.Title style={{borderBottom:'1ps solid 0px 2px 4px rgba(0,0,0,0.1)'}} className='' level={4}>
          Chat with {selectedUser || '...'}
        </Typography.Title> */}
         {selectedUser && (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '0.5rem 1rem',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      marginBottom: '0.5rem',
      // flexDirection: 'column  ',
    }}>
<Avatar style={{ marginRight: '1rem', backgroundColor: avatarColor }}>
  {selectedUser[0]}
</Avatar>      <div className='d-flex flex-column' style={{ flex: 2 }}>

      <div>

      <Typography.Title level={5} style={{ margin: 0 }}>{selectedUser}</Typography.Title>
      </div>
      <div className=''>

      <Typography.Text type={onlineUsers.includes(selectedUser) ? 'success' : 'secondary'}>
        {onlineUsers.includes(selectedUser) ? 'Online' : 'Offline'}
      </Typography.Text>
      </div>
      </div>
     <Dropdown
  menu={{
    items: [
      { key: 'clear', label: 'Clear Messages' },
      { key: 'export', label: 'Export Chat' },
    ],
    onClick: ({ key }) => {
      if (key === 'clear') handleClear();
      if (key === 'export') handleExport();
    },
  }}
>
  <Button icon={<MoreOutlined />} type="text" />
</Dropdown>


    </div>
  )}

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', padding: '0 1rem' }}>
  {messages.map((msg) => {
    const isSender = msg.from === currentUser;
      const userIndex = users.findIndex((u) => u.username === msg.from);
  const color = ColorList[userIndex % ColorList.length] || '#ccc';

    return (
      <div
        key={msg._id}
        style={{
          display: 'flex',
          justifyContent: isSender ? 'flex-end' : 'flex-start',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: isSender ? 'row-reverse' : 'row',
            gap: '8px',
          }}
        >
          {/* Avatar */}
           <Avatar style={{ backgroundColor: color }}>
          {msg.from[0].toUpperCase()}
        </Avatar>

          {/* Message Bubble */}
          <div
            style={{
              maxWidth: '100%',
              maxHeight:'100%',
              padding: '10px 15px',
              borderRadius: '20px',
              backgroundColor: isSender ? '#d4f8c4' : '#f0f0f0',
              color: '#000',
            }}
          >
            <div style={{ fontSize: '0.85rem' }}>
  {msg.text && <span>{msg.text}</span>}
  {msg.imageUrl && (
    <Image
      src={msg.imageUrl}
      alt="chat-image"
      width={400}
      height={300}
      style={{ marginTop: '1px', borderRadius: '12px',marginRight: '1px',padding: '4px' }}
    />
  )}
</div>

          </div>

          {/* Dropdown Dots */}
          <Dropdown
            menu={{
              items: [
                {
                  key: 'delete',
                  label: <span onClick={() => handleDelete(msg._id)}>Delete</span>,
                },
              ],
            }}
            placement={isSender ? 'bottomLeft' : 'bottomRight'}
          >
            <div style={{ cursor: 'pointer' }}>
              <MoreOutlined />
            </div>
          </Dropdown>
        </div>
      </div>
    );
  })}
  <div ref={messagesEndRef}></div>
</div>

{typingUser && selectedUser && typingUser === selectedUser && (
  <div style={{ fontStyle: 'italic', color: '#888', marginBottom: '8px' }}>
    {typingUser} is typing...
  </div>
)}




       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <SmileOutlined
    onClick={() => setShowEmojiPicker((prev) => !prev)}
    style={{ fontSize: '24px', cursor: 'pointer' }}
  />
  {showEmojiPicker && (
    <div style={{ position: 'absolute', bottom: '60px', zIndex: 10 }}>
      <EmojiPicker   onEmojiClick={handleEmojiClick} />
    </div>
  )}
  <ImageUpload onUploadSuccess={handleImageSend} />

  <Input.Search
    placeholder="Type a message"
    enterButton={<SendOutlined />}
    value={newMessage}
    onChange={handleTyping}
    onSearch={handleSend}
    disabled={!selectedUser}
    size='large'
  />
</div>

      </Splitter.Panel>
    </Splitter>
    </div>
  );
};


export default Chat;
