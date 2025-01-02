
const { Sequelize } = require('sequelize');

// Set up Sequelize connection
const sequelize = new Sequelize('coingate', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = sequelize;
