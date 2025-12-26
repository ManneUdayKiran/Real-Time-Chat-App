
# 💬 Real-Time Chat Application

A full-stack real-time chat app built with **MERN stack (MongoDB, Express, React, Node.js)** and **Socket.IO**. It supports **one-on-one messaging**, **real-time typing indicators**, **emoji picker**, **image upload**, and **theme toggling**.

Hosted on:
https://real-time-chat-app-three-umber.vercel.app/
---

## 🚀 Features

- 🔐 User Authentication (Register & Login)
- 👥 View and chat with other online users
- 💬 Real-time messaging using **Socket.IO**
- ✍️ Typing indicator
- 😀 Emoji picker (via `emoji-picker-react`)
- 🖼️ Image upload support
- 🌗 Light/Dark theme toggle
- 📁 Export chat & Clear history options
- 🗑️ Per-message deletion
- 🧪 Fully responsive and mobile-friendly UI

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Ant Design (UI)
- Socket.IO client
- Axios
- React Router DOM
- Emoji Picker

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Socket.IO server
- JWT Authentication
- Multer for image uploads
- CORS

---

## 📦 Installation & Setup

### Clone Repo

```bash
git clone https://github.com/<your-username>/real-time-chat-app.git
cd real-time-chat-app
````

### 🔧 Backend Setup

```bash
cd backend
npm install
touch .env
```

**`.env` file**

```env
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-secret>
PORT=8000
```

**Run backend:**

```bash
node server.cjs
```

> Make sure you configure CORS properly if running frontend on a different domain.

---

### 💻 Frontend Setup

```bash
cd frontend
npm install
```

**`.env` file**

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

**Run frontend:**

```bash
npm run dev
```

---

## 📁 Folder Structure

```
root
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── uploads/
│   ├── server.cjs
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
```

---



## 🧠 Future Enhancements

* ✅ Group chat support
* ✅ Seen/Delivered status
* ✅ Voice/video calling
* ✅ Notifications & PWA support
* ✅ Ai Implementation

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 🤝 Contributing

Feel free to fork, suggest features, or open pull requests. Contributions are welcome!

