'use strict'

var mysql = require('mysql');

var _pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    port: 3307,
    user: 'root',
    //password: 'root',
    database: 'wechat'
});

module.exports = _pool;