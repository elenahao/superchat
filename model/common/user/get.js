'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

/**
 * 获取单个用户信息 promise
 * @param {Number} 用户uid
 *
 * @return {Object} 用户信息
 */
function _getUser(uid) {
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
            _.extend(_user, {
                lastFight: _user.lastFight ? JSON.parse(_user.lastFight) : null,
                achievement: JSON.parse(_user.achievement),
                playset: JSON.parse(_user.playset)
            });
            console.log('_user'+_user);
            dfd.resolve(_user);
        }, function reject(err) {
            dfd.reject({
                err: 'user not found'
            });
        }); // end of Q
    } // end of if uid

    return dfd.promise;
} // end of _getUser

module.exports = _getUser;
