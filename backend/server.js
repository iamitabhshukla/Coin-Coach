const app = require('./src/app');
const { sequelize } = require('./src/models'); // Will be created promptly

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        console.log('Database authenticating...');
        await sequelize.authenticate();
        console.log('Database connected!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
