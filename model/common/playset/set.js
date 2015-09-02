'use strict';

var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var path = require('path');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

/**
 * 添加题目 promise
 * @param {Number} 题目fid
 * @param {Object} 题目内容
 *
 * @return {Boolean} 是否更新成功
 */
function _setPlayset(pid, data) {
    var dfd = Q.defer();
    if (pid == undefined || Lazy(data).isEmpty()) {
        dfd.reject({
            err: 'param error'
        });
    } else {
        var _playset = data;
        _.extend(_playset,{
            questions: JSON.stringify(_playset.questions)
        });
        Q(
            redis.hmset('playset:' + pid, _playset)
        ).then(function resolve(res) {
            // console.log(res);
            dfd.resolve(true);
        }, function reject(err) {
            dfd.reject(err);
        });// end of Q
    } // end of if pid data

    return dfd.promise;
} // end of _setPlayset

module.exports = _setPlayset;
