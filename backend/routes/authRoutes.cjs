const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.cjs');
// const authMiddleware = require('../middlewares/authMiddleware.cjs');
const authMiddleware = require('../middlewares/authMiddleWare.cjs'); // 👈 Use the correct path

router.post('/register', authController.register);
router.post('/login', authController.login); // 👈 Add this

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ message: 'You are authenticated', user: req.user });
});

module.exports = router;
