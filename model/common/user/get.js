'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getUser = function(uid) {
    var dfd = Q.defer();

    if (uid == undefined) {
        dfd.reject({
            err: 'uid is undefined'
        });
    } else {
        Q(
            redis.hgetall('user:' + uid)
        ).then(function resolve(res) {
            var _user = res;
            dfd.resolve(_user);
        }, function reject(err) {
            dfd.reject({
                err: 'user not found'
            });
        }); // end of Q
    } // end of if uid

    return dfd.promise;
};

module.exports = _getUser;
