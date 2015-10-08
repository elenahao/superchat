'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));

var _getAllGroup = function() {
    var dfd = Q.defer();
    redis.get('allgs').then(function done(allgs){
        dfd.resolve(JSON.parse(allgs));
    },function err(err){
        mysql.group.findAllGroups().then(function done(groups){
            redis.set('allgs', JSON.stringify(groups));
            redis.client.expire('allgs', 20);
            dfd.resolve(groups);
        },function err(err){
            dfd.reject(err);
        })
    });

    return dfd.promise;
}

module.exports = _getAllGroup;
