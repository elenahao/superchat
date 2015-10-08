'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));

var _getPagingGroup = function(pageNo, pageSize) {
    console.log('in getPagingQuery....');
    var dfd = Q.defer();
    mysql.group.findGroupsByPage(pageNo, pageSize).then(function resolve(res){
        console.log('res=',res);
        dfd.resolve(res);
    },function reject(err){
        console.log('findGroupsByPage err:', err);
        dfd.reject(err);
    });

    return dfd.promise;
}

module.exports = _getPagingGroup;
