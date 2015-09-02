'use strict';

var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getPlayset = require('./get');

/**
 * 获取多个题集 promise
 * @param {Array} 题集pids
 *
 * @return {Array} 题集
 */
function _getPlaysets(pids) {
    var dfd = Q.defer();
    if (Lazy(pids).isEmpty()) {
        dfd.reject({
            err: 'pids is empty'
        });
    } else {
        var queue = [];

        Lazy(pids).each(function(pids) {
            queue.push(_getPlayset(pids));
        });

        Q.all(
            queue
        ).then(function resolve(res) {
            if (!Lazy(res).isEmpty()) {
                dfd.resolve(res);
            } else {
                dfd.reject({
                    err: 'playset not found'
                });
            }
        }, function reject(err){
            dfd.reject({
                err: err
            });
        }); // end of Q
    } // end of if pids

    return dfd.promise
} // end of _getPlaysets

module.exports = _getPlaysets;
