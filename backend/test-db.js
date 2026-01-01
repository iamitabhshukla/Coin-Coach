const { Client } = require('pg');
// Connect to default 'postgres' database to create the new one
const connectionString = 'postgres://postgres:root1234@localhost:5432/postgres';
const client = new Client({ connectionString });

client.connect()
    .then(async () => {
        console.log('Connected to Postgres root db');
        try {
            await client.query('CREATE DATABASE finance_tracker');
            console.log('Database finance_tracker created successfully');
        } catch (e) {
            if (e.code === '42P04') { // duplicate_database
                console.log('Database finance_tracker already exists');
            } else {
                console.log('Database creation failed:', e.message);
            }
        }
        client.end();
    })
    .catch(err => {
        console.error('Connection error:', err.message);
        process.exit(1);
    });
