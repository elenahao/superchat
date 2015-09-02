'use strict';

var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var path = require('path');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

var _template = require('./genFightTemplate');
var _getFight = require('./get');

/**
 * 添加对战历史 promise
 * @param {Number} 对战fid
 * @param {Object} 战斗记录
 *
 * @return {Boolean} 是否更新成功
 */
function _setFight(fid, data) {
    var dfd = Q.defer();
    var _fid, _data;

    if (arguments.length == 1 && _.isObject(fid) && !Lazy(fid).isEmpty()) {
        _data = fid;
        _data = _.extend(_template(_data), {
            detail: JSON.stringify(_data.detail)
        });
         _set();
    } else if (fid != undefined && _.isObject(data) && !Lazy(data).isEmpty()) {
        _fid = fid;
        _data = data;
        _data = _.extend(_data, {
            detail: JSON.stringify(_data.detail)
        });
         _set();
    } else {
        dfd.reject({
            err: 'params error'
        });
    } // end of if fid data

    function _set(){
        // console.log(_fid,_data);
        Q(
            redis.hmset('fight:' + _fid, _data)
        ).then(function(res) {
            // console.log(res);
            dfd.resolve(true);
        }, function(err) {
            dfd.reject(err);
        });
    } // end of _set

    return dfd.promise;
} // end of _setFight

module.exports = _setFight;
