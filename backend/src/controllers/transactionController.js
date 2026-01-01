const { Transaction, Category, User } = require('../models');
const { Op } = require('sequelize');
const redisClient = require('../config/redis');

// Helper to invalidate analytics cache for a user
const invalidateCache = async (userId) => {
    try {
        if (!redisClient.isOpen) {
            console.log('Redis not open, skipping invalidation');
            return;
        }
        await redisClient.del(`analytics:overview:${userId}`);
        await redisClient.del(`analytics:category:${userId}`);
        console.log(`[Cache] Invalidated detailed analytics for user ${userId}`);
    } catch (e) {
        console.error('[Cache] Invalidation failed:', e);
    }
};

exports.addTransaction = async (req, res) => {
    try {
        const { amount, type, description, category, date } = req.body;

        // Find or create category
        const [catObj] = await Category.findOrCreate({
            where: { name: category },
            defaults: { name: category }
        });

        const transaction = await Transaction.create({
            userId: req.user.id,
            amount,
            type,
            description,
            date: date || new Date(),
            categoryId: catObj.id
        });

        await invalidateCache(req.user.id);
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const { type, category, startDate, endDate, page = 1, limit = 10, search } = req.query;
        console.log(`[API] getTransactions Query: page=${page}, limit=${limit}`, req.query);
        const offset = (page - 1) * limit;

        const where = { userId: req.user.id };

        if (type) where.type = type;
        if (startDate && endDate) {
            where.date = { [Op.between]: [startDate, endDate] };
        }
        if (search) {
            where.description = { [Op.iLike]: `%${search}%` };
        }

        const include = [{ model: Category, attributes: ['name'] }];
        if (category) {
            include[0].where = { name: category };
        }

        const { count, rows } = await Transaction.findAndCountAll({
            where,
            include,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['date', 'DESC']]
        });

        console.log(`[API] getTransactions Result: ${count} found, returning ${rows.length}`);

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            transactions: rows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, type, description, category, date } = req.body;

        const transaction = await Transaction.findOne({
            where: { id, userId: req.user.id }
        });

        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

        if (category) {
            const [catObj] = await Category.findOrCreate({ where: { name: category } });
            transaction.categoryId = catObj.id;
        }

        transaction.amount = amount || transaction.amount;
        transaction.type = type || transaction.type;
        transaction.description = description || transaction.description;
        transaction.date = date || transaction.date;

        await transaction.save();

        await invalidateCache(req.user.id);
        res.json(transaction);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Transaction.destroy({
            where: { id, userId: req.user.id }
        });

        if (!deleted) return res.status(404).json({ message: 'Transaction not found' });

        await invalidateCache(req.user.id);
        res.json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
