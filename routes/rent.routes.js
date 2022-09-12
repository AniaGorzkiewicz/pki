const express = require('express');
const rentsController = require('../controllers/rents.controller');
const authMiddleware = require('../middleware/authenicate.middleware');
const adminAuthMiddleware = require('../middleware/admin_authenticate.middleware');
const router = express.Router();

router.get('/', authMiddleware, adminAuthMiddleware, rentsController.index);
router.patch('/:id', authMiddleware, adminAuthMiddleware, rentsController.updateRent);
router.get('/my', authMiddleware, rentsController.myRents);
router.post('/', authMiddleware, adminAuthMiddleware, rentsController.createRent);
router.delete('/:id', authMiddleware, adminAuthMiddleware, rentsController.deleteRent);

module.exports = router;