'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

/**
 * 获取用户对战历史信息 promise
 * @param {Number} 用户uid
 *
 * @return {Object} 用户信息
 */
function _getHistory(uid) {
    var dfd = Q.defer();
    if (uid == undefined) {
        dfd.reject({
            err: 'uid is undefined'
        });
    } else {
        Q(
            redis.hgetall('history:' + uid)
        ).then(function resolve(res) {
            var _history = res;
            _.extend(_history, {
                targets: JSON.parse(_history.targets),
                fitghts: JSON.parse(_history.fitghts)
            });
            // console.log(_user);
            dfd.resolve(_history);
        }, function reject(err) {
            dfd.reject({
                err: 'history not found'
            });
        }); // end of Q
    } // end of if uid

    return dfd.promise;
} // end of _getHistory

module.exports = _getHistory;
