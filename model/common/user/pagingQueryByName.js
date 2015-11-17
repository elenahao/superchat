'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));

var _getPagingUserByName = function(pageNo, pageSize, uname) {
    console.log('in getPagingQueryByName....');
    var dfd = Q.defer();
    mysql.user.findUsersByName(pageNo, pageSize, uname).then(function resolve(res){
        console.log('is findUsersByName ok:', res);
        dfd.resolve(res);
    },function reject(err){
        console.log('findUsersByName err:', err);
        dfd.reject(err);
    });

    return dfd.promise;
}

module.exports = _getPagingUserByName;
