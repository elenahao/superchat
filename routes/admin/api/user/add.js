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

// 获取指定分页和个数的用户
app.get('/admin/api/user/add', function(req, res) {
    console.log("admin user get...");
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
            ACCESS_TOKEN = _data.access_token;//
            console.log('access_token='+ACCESS_TOKEN);
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/user/get?access_token='+ACCESS_TOKEN,
                method: 'GET'
            }, function(err, res, body) {
                if(err) console.log(err);
                console.log('======'+body);
                if (res.statusCode === 200) {
                    console.log('success');
                    //存入redis
                    var _body = JSON.parse(body);
                    var total = _body.total;
                    var count = _body.count;
                    var data = _body.data;
                    var openids = data.openid;
                    var next_openid = data.next_openid;
                    for(var i = 0; i< openids.length; i++){
                        var openid = openids[i];
                        var options = {
                            openid : openid
                        }
                        redis.hmset('user:'+openid, options)
                            .then(function resolve(res) {
                                console.log('is set ok:', res);
                            }, function reject(err) {
                                dfd.reject(err);
                            })
                    }
                    if(total != count){
                        getUser(ACCESS_TOKEN, next_openid);
                    }
                }
            });
        }
    });
    res.send('get user success');
});

var getUser = function(ACCESS_TOKEN, next_openid) {
    request({
        url: 'https://api.weixin.qq.com/cgi-bin/user/get?access_token='+ACCESS_TOKEN+'&next_openid='+next_openid,
        method: 'GET'
    }, function(err, res, body){
        var _body = JSON.parse(body);
        var total = _body.total;
        var count = _body.count;
        var data = _body.data;
        var openids = data.openid;
        var next_openid = data.next_openid;
        for(var i = 0; i< openids.length; i++){
            var openid = openids[i];
            var options = {
                openid : openid
            }
            redis.hmset('user:'+openid, options)
                .then(function resolve(res) {
                    console.log('is set ok:', res);
                }, function reject(err) {
                    dfd.reject(err);
                })
        }
        if(count != 10000){
            //结束,last time
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/user/get?access_token='+ACCESS_TOKEN+'&next_openid='+next_openid,
                method: 'GET'
            }, function(err, res, body) {
                var _body = JSON.parse(body);
                var total = _body.total;
                var count = _body.count;
                var data = _body.data;
                var openids = data.openid;
                var next_openid = data.next_openid;
                for (var i = 0; i < openids.length; i++) {
                    var openid = openids[i];
                    var options = {
                        openid: openid
                    }
                    redis.hmset('user:' + openid, options)
                        .then(function resolve(res) {
                            console.log('is set ok:', res);
                        }, function reject(err) {
                            dfd.reject(err);
                        })
                }
            });
        }else{
            getUser(ACCESS_TOKEN, next_openid);
        }
    });

}