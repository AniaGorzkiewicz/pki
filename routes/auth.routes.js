const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authenicate.middleware');
const router = express.Router();

router.post('/sign_in', authController.signIn);
router.post('/sign_up', authController.signUp);
router.get('/me', authMiddleware, authController.me);

module.exports = router;