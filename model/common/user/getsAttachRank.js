'use strict';

var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getUser = require('./getAttachRank');

/**
 * 获取多个用户信息 promise
 * @param {Array} 用户uid数组
 *
 * @return {Array} 用户信息
 */
function _getUsers(users) {
    var dfd = Q.defer();
    if (Lazy(users).isEmpty()) {
        dfd.reject({
            err: 'users is empty'
        });
    } else {
        var queue = [];

        Lazy(users).each(function(uid) {
            queue.push(_getUser(uid));
        });

        Q.all(
            queue
        ).then(function resolve(res) {
            if (!Lazy(res).isEmpty()) {
                console.log('res='+res);
                dfd.resolve(res);
            } else {
                dfd.reject({
                    err: 'user not found'
                });
            }
        }, function reject(err) {
            dfd.reject({
                err: err
            });
        }); // end of Q
    } // end of if users

    return dfd.promise
} // end of _getUsers

module.exports = _getUsers;
