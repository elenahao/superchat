'use strict';

var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getFight = require('./get');

/**
 * 获取多个对战记录 promise
 * @param {Array} 对战fid数组
 *
 * @return {Array} 对战记录
 */
function _getFights(fids) {
    var dfd = Q.defer();
    if (Lazy(fids).isEmpty()) {
        dfd.reject({
            err: 'fids is empty'
        });
    } else {
        var queue = [];

        Lazy(fids).each(function(fid) {
            queue.push(_getFight(fid));
        });

        Q.all(
            queue
        ).then(function resolve(res) {
            if (!Lazy(res).isEmpty()) {
                dfd.resolve(res);
            } else {
                dfd.reject({
                    err: 'fights not found'
                });
            }
        }, function reject(err){
            dfd.reject({
                err: err
            });
        }); // end of Q
    } // end of if fids

    return dfd.promise
} // end of _getFights

module.exports = _getFights;
