'use strict';

var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');

var _setUser = require('./set');
var UserTemplate = require('./genUserTemplate');

/**
 * 添加新用户 promise
 * @param {Number} 用户uid
 * @param {Object} 用户信息
 *
 * @return {Boolean} 是否添加成功
 */
function _newUser(uid, data) {
    var dfd = Q.defer();
    if (fid == undefined || Lazy(data).isEmpty()) {
        dfd.reject({
            err: 'param error'
        });
    } else {
        _user = UserTemplate(data);

        _setUser(uid, _user).then(function resolve(isSuccess) {
            dfd.resolve(isSuccess);
        }, function reject(err) {
            dfd.reject(err);
        }); // end of _setUser
    } // end of if fid data

    return dfd.promise;
}

module.exports = _newUser;
