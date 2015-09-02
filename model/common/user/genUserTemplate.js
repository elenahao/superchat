'use strict';

var _ = require('lodash');

/**
 * 生成新用户数据模板
 * @param {Object} 新用户信息
 *
 * @return {Object} 新用户信息模板
 */
function _genNewUserTemplate(config) {
    var _user = {
        uid: 0,
        name: '',
        avatar: '',
        score: 0,
        times: 0,
        total_times: 0,
        level: 1,
        exp: 0,
        challenge: 10,
        new_tor: 3,
        lastFight: null,
        achievement: [],
        playset: []
    };
    _.extend(_user, config);
    return _user;
} // end of _genNewUserTemplate

module.exports = _genNewUserTemplate
