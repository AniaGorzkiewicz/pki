const express = require('express');
const usersController = require('../controllers/users.controller');
const authMiddleware = require('../middleware/authenicate.middleware');
const adminAuthMiddleware = require('../middleware/admin_authenticate.middleware');
const router = express.Router();

router.get('/', authMiddleware, adminAuthMiddleware, usersController.index);
router.patch('/:id', authMiddleware, adminAuthMiddleware, usersController.adminUpdateUser);
router.delete('/:id', authMiddleware, adminAuthMiddleware, usersController.deleteUser);

module.exports = router;