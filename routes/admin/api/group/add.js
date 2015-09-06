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

// 获取指定分页和个数的组
app.get('/admin/api/group/add', function(req, res) {
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
                    //存入redis
                    var data = JSON.parse(body);
                    var groups = data.groups;
                    for(var i = 0; i< groups.length;i++){
                        var group = groups[i];
                        var key = 'group:'+group.id;
                        redis.hmset(key, group)
                            .then(function resolve(res) {
                                console.log('is hmset ok:', res);
                            }, function reject(err) {
                                dfd.reject(err);
                            })
                    }
                }
            });
        }
    });
    res.end('get group success');
});
