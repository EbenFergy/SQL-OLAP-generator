const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  database: 'Data_Warehouse',
  user: 'root',
  password: '',
});

module.exports = db;
