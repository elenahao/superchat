/**
 * Created by elenahao on 15/9/1.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

/* GET home page. */
app.get(['/admin/wechat/group'], function(req, res, next) {
    console.log('admin group...');
    res.render('admin/wechat/group/init');
});

