//conexion a la bd

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Frelody1972',
    database: 'cecyt9',
    dateStrings: true,
});

module.exports = pool;