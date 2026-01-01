const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { transactionLimiter } = require('../middleware/rateLimiter');

// Apply Global Transaction Rate Limit
router.use(transactionLimiter);

// All transaction routes require authentication
router.use(authenticateToken);

// Read-only, User, Admin
router.get('/', transactionController.getTransactions);

// User, Admin only
router.post('/', authorizeRoles('admin', 'user'), transactionController.addTransaction);
router.put('/:id', authorizeRoles('admin', 'user'), transactionController.updateTransaction);
router.delete('/:id', authorizeRoles('admin', 'user'), transactionController.deleteTransaction);

module.exports = router;
