'use strict';

var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

/**
 * 更改用户信息 promise
 * @param {Number} 用户uid
 * @param {Object} 更新数据
 *
 * @return {Boolean} 是否更新成功
 */
function _setUser(uid, data) {
    var dfd = Q.defer();
    if (uid == undefined || Lazy(data).isEmpty()) {
        dfd.reject({
            err: 'param error'
        });
    } else {
        var _data = data;
        _.extend(_data, {
            lastFight: _data.lastFight ? JSON.stringify(_data.lastFight) : null,
            achievement: JSON.stringify(_data.achievement),
            playset: JSON.stringify(_data.playset)
        });

        Q(
            redis.hmset('user:' + uid, _data)
        ).then(function resolve(res) {
            console.log('is set ok:', res);
            dfd.resolve(true);
        }, function reject(err) {
            dfd.reject(err);
        }); // end of Q
    } // end of if uid

    return dfd.promise;
} // end of _setUser

module.exports = _setUser;
