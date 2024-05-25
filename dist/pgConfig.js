"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    username: 'postgres',
    host: 'localhost',
    database: "postgres",
    password: "root",
    port: 5432,
    dialect: "postgres",
});
sequelize.authenticate()
    .then(() => {
    console.log('Connected to database Succesfully.');
})
    .catch((error) => {
    console.error('Failed to connect to the database:', error);
});
sequelize.sync()
    .then(() => {
    console.log('Models synchronized with the database.');
})
    .catch((err) => {
    console.error('Unable to synchronize models with the database:', err);
});
exports.default = sequelize;
