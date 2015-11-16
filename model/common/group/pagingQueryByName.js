'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));

var _getPagingGroupByName = function(pageNo, pageSize, gname) {
    console.log('in getPagingQueryByName....');
    var dfd = Q.defer();
    mysql.group.findGroupsByName(pageNo, pageSize, gname).then(function resolve(res){
        console.log('is findGroupsByName ok:', res);
        dfd.resolve(res);
    },function reject(err){
        console.log('findGroupsByName err:', err);
        dfd.reject(err);
    });

    return dfd.promise;
}

module.exports = _getPagingGroupByName;
