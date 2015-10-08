'use strict'

var mysql = require('mysql');

var _pool = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    database: 'wechat'
});

module.exports = _pool;