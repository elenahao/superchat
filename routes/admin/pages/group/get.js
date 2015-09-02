/**
 * Created by elenahao on 15/9/1.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');

/* GET home page. */
app.get(['/admin/group'], function(req, res, next) {
    console.log('admin group...');
    res.render('admin/wechat/group/init');
});

// 获取指定分页和个数的组
app.get('/admin/group/get', function(req, res) {
    console.log("admin group get...");
    var APPID = 'wx0c7c93d636ff9769';
    var APPSECRET = 'd4a38c7b7804febf8c33045005713191';
    var ACCESS_TOKEN = '';
    request({
        url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+APPID+'&secret='+APPSECRET,
        method: 'GET'
    }, function(err, res, body) {
        if(err) console.log(err);
        if (res.statusCode === 200) {
            var _data = JSON.parse(body);
            ACCESS_TOKEN = _data.access_token;//['access_token'];
            console.log('access_token='+ACCESS_TOKEN);
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/groups/get?access_token='+ACCESS_TOKEN,
                method: 'GET'
            }, function(err, res, body) {
                if(err) console.log(err);
                console.log('======'+body);
                if (res.statusCode === 200) {
                    console.log('success');
                }
            });
        }
    });
});
