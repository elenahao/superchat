'use strict'

var mysql = require('mysql');

//var _pool = mysql.createPool({
//    connectionLimit : 10,
//    host: '172.16.39.13',
//    port: 3307,
//    user: 'root',
//    database: 'wechat'
//});

var _pool = mysql.createPool({
    connectionLimit : 10,
    host: '10.66.116.8',
    port: 3306,
    user: 'superchat',
    password: 'gQhH_IPQagOlahQfIUm9kdSM4',
    database: 'wechat'
});

module.exports = _pool;