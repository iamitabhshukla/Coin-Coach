const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests
    message: { message: 'Too many auth requests, please try again later.' }
});

const transactionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // 100 requests
    message: { message: 'Transaction API rate limit exceeded.' }
});

const analyticsLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // 50 requests
    message: { message: 'Analytics API rate limit exceeded.' }
});

module.exports = {
    authLimiter,
    transactionLimiter,
    analyticsLimiter
};
