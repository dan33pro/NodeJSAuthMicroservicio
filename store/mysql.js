const postgres = require('mysql');

const config = require('../config');

const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

// Connect!
let connection;

function handleCon() {
    connection = mysql.createConnection(dbconf);
}