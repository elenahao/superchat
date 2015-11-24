'use strict'

var mysql = require('mysql');

var _pool = mysql.createPool({
    connectionLimit : 10,
    host: '127.0.0.1',
    port: 3307,
    user: 'root',
    database: 'wechat'
});

//var _pool = mysql.createPool({
//    connectionLimit : 10,
//    host: '10.66.116.8',
//    port: 3306,
//    user: 'superchat',
//    password: 'gQhH_IPQagOlahQfIUm9kdSM4',
//    database: 'superchat'
//});

module.exports = _pool;