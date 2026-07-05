const sequelize = require('../config/database');
const Todo = require('./todo.model');

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully');

        await sequelize.sync({
            alter: true
        })

        console.log('Database synced successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = {
    sequelize,
    Todo,
    connectDatabase
};