const express = require('express');
const router = express.Router();
const User = require('../models/User.cjs');
const verifyToken = require('../middlewares/auth.cjs'); // JWT middleware

// GET /api/users - return all users except the one making the request
router.get('/', verifyToken, async (req, res) => {
  try {
    const currentUser = req.user.username; // Extracted from JWT by verifyToken
    const users = await User.find({ username: { $ne: currentUser } }, 'username email');
    res.json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
