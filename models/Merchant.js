const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import your Sequelize connection

const Merchant = sequelize.define('Merchant', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    merchant_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    business_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    merchant_email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mobile_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    tableName: 'merchants', // Your MySQL table name
    timestamps: false, // Set to true if you have `createdAt` and `updatedAt` fields
});

module.exports = Merchant;
