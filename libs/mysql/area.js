'use strict'

var Q = require('q');
var pool = require('./client');

exports.findAllCountries = function () {
    console.log('in findAllCountries...');
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log('getConnection...');
        conn.query("select distinct(country) as name from wx_area", function (err, rows) {
            if(err){
                dfd.reject(err);
            }else{
                dfd.resolve(rows);
            }
            conn.release();
        });
    });
    return dfd.promise;
};

exports.findProvinceByCountry = function (country) {
    console.log('in findProvinceByCountry...');
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log('getConnection...');
        conn.query("select distinct(province) as name from wx_area where country=?", country, function (err, rows) {
            if(err){
                dfd.reject(err);
            }else{
                dfd.resolve(rows);
            }
            conn.release();
        });
    });
    return dfd.promise;
};

exports.findCityByProvince = function (province) {
    console.log('in findCityByProvince...');
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log('getConnection...');
        conn.query("select distinct(city) as name from wx_area where province=?", province, function (err, rows) {
            if(err){
                dfd.reject(err);
            }else{
                dfd.resolve(rows);
            }
            conn.release();
        });
    });
    return dfd.promise;
};
