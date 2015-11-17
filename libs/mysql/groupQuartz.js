'use strict'

var Q = require('q');
var pool = require('./client');

exports.addGroupQuartz = function (option) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        conn.query('insert into wx_group_quartz (group_id, country, province, city, sex, subscribe_start, subscribe_end) values (?,?,?,?,?,?,?)', [option.groupid, option.country, option.province, option.city, option.sex, option.subscribe_start, option.subscribe_end], function (err, ret) {
            if (err) {
                console.error(err);
                dfd.reject(err);
            }
            else {
                dfd.resolve(ret);
            }
            conn.release();
        })
    })
    return dfd.promise;
};
