const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authenticateToken = require('../middleware/authMiddleware');
const { analyticsLimiter } = require('../middleware/rateLimiter');

// Rate Limit
router.use(analyticsLimiter);
// Auth
router.use(authenticateToken);

router.get('/overview', analyticsController.getOverview);
router.get('/category', analyticsController.getCategoryBreakdown);
router.get('/trends', analyticsController.getMonthlyTrends);

module.exports = router;
