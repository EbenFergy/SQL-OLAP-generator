const express = require('express');
const app = express();
const mysql = require('mysql');
const { inputParser } = require('./helpers.js');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

app.listen(8081, () => {
  console.log('port 3000 running...');
  db.connect(err => {
    if (err) throw err;
    else {
      console.log('...database connected');
    }
  });
});

const db = mysql.createConnection({
  host: 'localhost',
  database: 'Data_Warehouse',
  user: 'root',
  password: process.env.DATABASE_PASSWORD,
});

const query = inputParser('Get the number of international students graduated in years 89, 90, and 91');

console.log('query', query);

app.get('/', (req, res) => {
  db.query(query, function (err, results) {
    if (err) throw err;
    res.send(results);
  });
});

app.post('/input', (req, res) => {
  console.log(req.body);
  const { OLAP, queryStringInterpolation } = inputParser(req.body.inputText);

  db.query(queryStringInterpolation, function (err, results) {
    console.log('queryStrinng', queryStringInterpolation);
    if (err) throw err;
    const responseData = {
      OLAP,
      queryStringInterpolation,
      results: Object.values(results[0])[0],
    };

    res.send(responseData);
  });

  console.log('type of OLAP', typeof OLAP.rollUps);
});
