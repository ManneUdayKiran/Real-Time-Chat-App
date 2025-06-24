const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Models and Routes
const Message = require('./models/Message.cjs');
const authRoutes = require('./routes/authRoutes.cjs');
const messageRoutes = require('./routes/messageRoutes.cjs');
const userRoutes = require('./routes/userRoutes.cjs');


const app = express();
const server = http.createServer(app);

// ✅ CORS setup (important for credentials + frontend port)
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
const uploadRoutes = require('./routes/uploadRoutes.cjs'); // Adjust path if needed

app.use('/api/uploads', uploadRoutes);
app.use('/uploads', express.static('uploads'));



// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ Mongo Error:', err));

// ✅ Socket.IO Initialization
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

const onlineUsers = new Map(); // username -> socket.id


// ✅ Socket.IO Event Handling
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

   socket.on('user_connected', (username) => {
    onlineUsers.set(username, socket.id);
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  // Typing indicator
  socket.on('typing', ({ from, to }) => {
    socket.broadcast.emit('typing', { from, to });
  });

  socket.on('stop_typing', ({ from, to }) => {
    socket.broadcast.emit('stop_typing', { from, to });
  });

  // Message handling
  socket.on('send_message', async (data) => {
  const { from, to, text='',imageUrl='' } = data;
  const newMessage = new Message({ from, to, text, imageUrl });

  try {
    const savedMessage = await newMessage.save(); // ✅ savedMessage includes _id
    console.log('✅ Message saved:', savedMessage);
    io.emit('receive_message', savedMessage); // ✅ send saved message with _id
  } catch (err) {
    console.error('❌ Error saving message:', err);
  }
});


  
   socket.on('disconnect', () => {
    for (const [username, id] of onlineUsers.entries()) {
      if (id === socket.id) {
        onlineUsers.delete(username);
        break;
      }
    }
    io.emit('online_users', Array.from(onlineUsers.keys()));
    console.log('🔴 User disconnected:', socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on http://localhost:${PORT}`);
});
