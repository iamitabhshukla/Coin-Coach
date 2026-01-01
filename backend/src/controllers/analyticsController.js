const { Transaction, Category, User, Sequelize } = require('../models');
const { Op } = require('sequelize');
const redisClient = require('../config/redis');

// Helper to check if redis is ready
const isRedisReady = () => redisClient.isOpen;

exports.getOverview = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = `analytics:overview:${userId}`;

        // if (isRedisReady()) {
        //     try {
        //         const cachedData = await redisClient.get(cacheKey);
        //         if (cachedData) {
        //             console.log(`[Analytics] Serving Overview from Cache for ${userId}`);
        //             return res.json(JSON.parse(cachedData));
        //         }
        //     } catch (e) {
        //         console.log('Redis get error', e.message);
        //     }
        // }

        console.log(`[Analytics] Calculating New Overview for ${userId}`);
        // Calculate Totals
        const income = await Transaction.sum('amount', { where: { userId, type: 'income' } }) || 0;
        const expense = await Transaction.sum('amount', { where: { userId, type: 'expense' } }) || 0;
        const balance = income - expense;

        const response = { income, expense, balance };

        if (isRedisReady()) {
            try {
                await redisClient.set(cacheKey, JSON.stringify(response), { EX: 900 }); // 15 mins
            } catch (e) {
                console.log('Redis set error', e.message);
            }
        }

        res.json(response);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCategoryBreakdown = async (req, res) => {
    try {
        const userId = req.user.id;
        const cacheKey = `analytics:category:${userId}`;

        // if (isRedisReady()) {
        //     try {
        //         const cachedData = await redisClient.get(cacheKey);
        //         if (cachedData) return res.json(JSON.parse(cachedData));
        //     } catch (e) { console.log('Redis error', e); }
        // }

        const data = await Transaction.findAll({
            where: { userId, type: 'expense' },
            attributes: [
                'categoryId',
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount']
            ],
            include: [{ model: Category, attributes: ['name'] }],
            group: ['categoryId', 'Category.id', 'Category.name'],
            raw: true
        });

        // Format data
        const formatted = data.map(item => ({
            category: item['Category.name'],
            amount: parseFloat(item.totalAmount)
        }));

        if (isRedisReady()) {
            try {
                await redisClient.set(cacheKey, JSON.stringify(formatted), { EX: 900 });
            } catch (e) { console.log('Redis set error', e); }
        }

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMonthlyTrends = async (req, res) => {
    try {
        const userId = req.user.id;
        // Simple trend: Last 6 months income vs expense
        // For brevity/complexity, we'll fetch all and process in JS or use complex query.
        // Let's use a simpler query for now.

        const transactions = await Transaction.findAll({
            where: { userId },
            attributes: ['type', 'amount', 'date'],
            order: [['date', 'ASC']]
        });

        // Group by Month-Year
        const trends = {};
        transactions.forEach(t => {
            const date = new Date(t.date);
            const key = `${date.getFullYear()}-${date.getMonth() + 1}`; // YYYY-M
            if (!trends[key]) trends[key] = { income: 0, expense: 0 };

            if (t.type === 'income') trends[key].income += parseFloat(t.amount);
            else trends[key].expense += parseFloat(t.amount);
        });

        res.json(trends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
