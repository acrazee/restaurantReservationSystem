const mysql = require('mysql');
//setup connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'reservations',
    connectionLimit: 10
});

module.exports = pool;