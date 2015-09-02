'use strict';

var Q = require('q');
var path = require('path');
var Lazy = require('lazy.js');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

/**
 * 添加排行 promise
 * @param {Number} 用户uid
 * @param {Object} 更新数据
 *
 * @return {Boolean} 是否更新成功
 */
function _addRank(data) {
    var dfd = Q.defer();
    if (Lazy(data).isEmpty()) {
        dfd.reject({
            err: 'param error'
        });
    } else {
        var _data = [];
        if(_.isArray(data)){
            Lazy(data).each(function(item){
                _data.push(item.score);
                _data.push(item.uid);
            });
        } else {
            _data.push(data.score);
            _data.push(data.uid);
        }

        console.log(_data);

        Q(
            redis.zadd('rank', _data)
        ).then(function resolve(res) {
            console.log('is set ok:', res);
            dfd.resolve(true);
        }, function reject(err) {
            dfd.reject(err);
        }); // end of Q
    } // end of if uid

    return dfd.promise;
} // end of _addRank

module.exports = _addRank;
