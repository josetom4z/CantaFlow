const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  togglePlan,
  getUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/toggle-plan', protect, togglePlan);
router.get('/profile', protect, getUserProfile);

module.exports = router;
