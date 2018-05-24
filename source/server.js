const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const api = require('./api');

const app = express();
const port = process.env.PORT || 8000;

const mysqlHost = process.env.MYSQL_HOST;
const mysqlPort = process.env.MYSQL_PORT || '3306';
const mysqlDBName = process.env.MYSQL_DATABASE;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;

const maxMySQLConnections = 10;
app.locals.mysqlPool = mysql.createPool({
  connectionLimit: maxMySQLConnections,
  host: mysqlHost,
  port: mysqlPort,
  database: mysqlDBName,
  user: mysqlUser,
  password: mysqlPassword
});


app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', function(req, res, next){
  console.log(req.url);
  console.log(req.body);
  next();
})

app.use('/', api);

app.use('*', function (req, res) {
  res.status(404).send("Our princess is in another castle");
});

app.listen(port, function() {
  console.log("== Server is running on port", port);
});
