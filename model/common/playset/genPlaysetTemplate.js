'use strict';

var _ = require('lodash');
var shortId = require('shortid');

/**
 * 生成新题集数据模板
 * @param {Object} 题集信息
 *
 * @return {Object} 题集信息模板
 */
function _genPlaysetTemplate(config) {
    var _playset = {
        pid: shortId.generate(),
        name: '',
        desc: '',
        lastModTime: (new Date()).toString(),
        coverUrl: '',
        questions: []
    };
    _.extend(_playset, config);
    return _playset;
} // end of _genQuestionTemplate

module.exports = _genPlaysetTemplate;
