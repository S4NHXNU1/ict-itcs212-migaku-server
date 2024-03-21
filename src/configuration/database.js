const mysql = require('mysql2');
const connection = require('./connection');

const pool = mysql.createPool({
    host: connection.host,
    user: connection.user,
    password: connection.password,
    database: connection.database
  });

module.exports = pool;