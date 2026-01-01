const { createClient } = require('redis');

const redisClient = createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379,
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.log('Redis reconnect exhausted. Proceeding without Redis.');
                return new Error('Redis connection retries exhausted');
            }
            return Math.min(retries * 50, 1000);
        }
    }
});

redisClient.on('connect', () => {
    console.log('Redis connecting...');
});

redisClient.on('ready', () => {
    console.log('Redis connected successfully');
});

redisClient.on('error', (err) => {
    console.error('Redis Client warning:', err.message);
    // Prevent crash on error
});

(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error('Redis initial connection failed - continuing without Redis:', err.message);
    }
})();

module.exports = redisClient;
