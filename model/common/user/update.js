'use strict';

var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _getUser = require('./get');
var _setUser = require('./set');

/**
 * 更改用户信息 promise
 * @param {Number} 用户uid
 * @param {Object} 更新数据
 *
 * @return {Boolean} 是否更新成功
 */
function _updateUser(uid, data) {
    var dfd = Q.defer();
    if (uid == undefined || Lazy(data).isEmpty()) {
        dfd.reject({
            err: 'param error'
        });
    } else {
        Q(
            _getUser(uid)
        ).then(function resolve(user) {
            var _user = _.extend(user, data);
            _setUser(_user.id, _user).then(function resolve(res) {
                dfd.resolve(true);
            }, function reject(err) {
                dfd.reject(err);
            }); // end of _setUser
        }, function reject(err) {
            // console.log(err.err);
            dfd.reject(err);
        }); // end of Q
    } // end of if uid data

    return dfd.promise;
} // end of _updateUser

module.exports = _updateUser;
