const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/userController');

// POST /api/user/register
router.post('/register', registerUser);

module.exports = router;
