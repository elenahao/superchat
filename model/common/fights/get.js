'use strict';

var Q = require('q');
var _ = require('lodash');
var path = require('path');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

/**
 * 获取单个对战信息 promise
 * @param {Number} 对战fid
 *
 * @return {Object} 战斗记录
 */
function _getFight(fid) {
    var dfd = Q.defer();
    if (fid == undefined || !_.isString(fid)) {
        dfd.reject({
            err: 'fid is undefined'
        });
    } else {
        Q(
            redis.hgetall('fight:' + fid)
        ).then(function resolve(res) {
            var _res = res;
            _.extend(_res, {
                detail: JSON.parse(_res.detail)
            });
            dfd.resolve(_res);
        }, function reject(err){
            dfd.reject({
                err: 'fight not found'
            });
        }); // end of Q
    } // end of if fid

    return dfd.promise;
} // end of _getFight

module.exports = _getFight;
