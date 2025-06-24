const express = require('express');
const router = express.Router();
const Message = require('../models/Message.cjs');

// Get messages between two users
router.get('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// backend/routes/messageRoutes.js (or similar)
router.delete('/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('❌ Failed to delete:', err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

router.delete('/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;

  try {
    const result = await Message.deleteMany({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    });

    res.json({ message: 'Messages cleared', deletedCount: result.deletedCount });
  } catch (err) {
    console.error('❌ Error deleting messages:', err);
    res.status(500).json({ message: 'Server error while deleting messages' });
  }
});

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  const url = `https://real-time-chat-app-tgy9.onrender.com/uploads/${file.filename}`;
  res.json({ url });
});


module.exports = router;
