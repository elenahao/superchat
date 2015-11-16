'use strict'

var mysql = require('mysql');

var _pool = mysql.createPool({
    connectionLimit : 10,
    host: '172.16.39.13',
    port: 3307,
    user: 'root',
    //password: 'root',
    database: 'wechat'
});

module.exports = _pool;