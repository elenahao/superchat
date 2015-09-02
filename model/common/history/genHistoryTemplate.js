'use strict';

var _ = require('lodash');
var shortId = require('shortid');

/**
 * 生成新对战数据模板
 * @param {Object} 新对战信息
 *
 * @return {Object} 新对战信息模板
 */
function _genHistoryTemplate(config) {
    var _history = {
        hid: shortId.generate(),
        targets: [], // {uid:xxx, name: '', avatar: '', win:1, lose:1,lastFight:{}}
        fitghts: [] // fid
    };
    _.extend(_history, config);
    return _history;
} // end of _genHistoryTemplate

module.exports = _genFightTemplate;
