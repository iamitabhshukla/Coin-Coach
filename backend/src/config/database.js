require('dotenv').config();

module.exports = {
    development: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        logging: false
    },
    test: {
        url: process.env.DATABASE_URL, // Use a test db in reality
        dialect: 'postgres',
        logging: false
    },
    production: {
        url: process.env.DATABASE_URL,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};
