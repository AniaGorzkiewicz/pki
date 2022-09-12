const express = require('express');
const booksController = require('../controllers/books.controller');
const authMiddleware = require('../middleware/authenicate.middleware');
const adminAuthMiddleware = require('../middleware/admin_authenticate.middleware');
const router = express.Router();

router.get('/', authMiddleware, booksController.index);
router.post('/', authMiddleware, adminAuthMiddleware, booksController.createBook);
router.delete('/:id', authMiddleware, adminAuthMiddleware, booksController.deleteBook);

module.exports = router;