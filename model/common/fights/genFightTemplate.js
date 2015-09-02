'use strict';

var _ = require('lodash');
var shortId = require('shortid');

/**
 * 生成新对战数据模板
 * @param {Object} 新对战信息
 *
 * @return {Object} 新对战信息模板
 */
function _genFightTemplate(config) {
    var _fight = {
        fid: shortId.generate(),
        playset: null,
        winner_id: null,
        owner_id: null,
        owner_score: 0,
        target_id: null,
        target_score: 0,
        detail: []
    };
    _.extend(_fight, config);
    return _fight;
} // end of _genFightTemplate

module.exports = _genFightTemplate;
