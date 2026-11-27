
const mysql = require('mysql2/promise');
const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '..', '.env')
});
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4_0900_ai_ci',

    connectionLimit: 10,
    dateStrings: true,
    waitForConnections: true,
    queueLimit: 0
});

module.exports = pool;
