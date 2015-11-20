'use strict';

var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var http = require('http');
var fs = require('fs');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));
var User = require(path.resolve(global.gpath.app.model + '/common/user'));

// 调取微信接口获取用户的详细信息
app.get('/admin/api/getInfo/user', function(req, res) {
    console.log("admin userInfo get...");
    var ACCESS_TOKEN = '';
    Token.getAccessToken().then(function resolve(ret) {
        if(ret.access_token){
            console.log(ret.access_token);
            ACCESS_TOKEN = ret.access_token;
            //从mysql获取所有用户openid 每次获取100
            var count = 100;
            var cursor = 0;
            scan(ACCESS_TOKEN, count, cursor).then(function done(ret){
                console.log('is getinfo ok:', ret);
                res.redirect('/admin/user');
            }, function err(err){
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: err
                }));
            });
        }
    },function reject(err){
        res.status(400).send(JSON.stringify({
            ret: -1,
            msg: err
        }));
    })
});

function scan(ACCESS_TOKEN, count, cursor) {
    var dfd = Q.defer();
    User.getOpenidByPage(cursor, count).then(function done(openids){
        if(openids.length > 0){
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token='+ACCESS_TOKEN,
                body: JSON.stringify({user_list: openids}),
                method: 'POST'
            }, function(err, res, body) {
                if (res.statusCode === 200) {
                    res.setEncoding('utf-8');
                    console.log('success');
                    body = body.replace(/\n/g, "").replace(/\r/g, "").replace(/\n\r/g, "").replace(/\r\n/g, "")
                        .replace(/\xEE[\x80-\xBF][\x80-\xBF]|\xEF[\x81-\x83][\x80-\xBF]|\xEF[\\xF0-\\x9F]/g, '')
                        .replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '')
                        //.replace(/\\"/g, '')
                        .replace(/\\/g, "")
                        .replace(/\t/g, "")
                        .replace(/\f/g, "");
                    var buf = new Buffer(body);
                    var decoder = new (require('string_decoder').StringDecoder)('utf-8')
                    try{
                        handle(JSON.parse(decoder.write(buf)), ACCESS_TOKEN, count, cursor, openids.length===count);
                    }catch(err){
                        var _x = body;
                        var end = 0;
                        var re = new RegExp("nickname","g");
                        var arr = _x.match(re);
                        for(var x = 0; x < arr.length; x ++){
                            var start = _x.indexOf("nickname", end)+11;
                            end = _x.indexOf("sex", start)-3;
                            var start_body = _x.slice(0, start);
                            var end_body = _x.slice(end, _x.length);
                            var slice_body = _x.slice(start, end);
                            slice_body = slice_body.replace(/\\/g, '').replace(/\\\\/g, '').replace(/\\'/g, '').replace(/\'/g, '').replace(/\\"/g, '').replace(/\"/g, '').replace(/,/g, '');
                            var buf = new Buffer(slice_body);
                            _x = start_body + buf.toString('utf8') + end_body;
                        }
                        try{
                            handle(JSON.parse(_x), ACCESS_TOKEN, count, cursor, openids.length===count);
                        }catch(err){
                            var _y = _x;
                            var end = 0;
                            var re = new RegExp("city","g");
                            var arr = _y.match(re);
                            for(var y = 0; y < arr.length; y++){
                                var start = _y.indexOf("city", end)+6;
                                end = _y.indexOf("headimgurl", start)-2;
                                var start_body = _y.slice(0, start);
                                var end_body = _y.slice(end, body.length);
                                _y = start_body + '"","province":"","country":""' + end_body;
                            }
                            try{
                                handle(JSON.parse(_y), ACCESS_TOKEN, count, cursor, openids.length===count);
                            }catch(err){
                                console.log(err);
                                cursor ++;
                                scan(ACCESS_TOKEN, count, cursor);
                            }
                        }
                    }
                }
            });
        }else{
            dfd.resolve('已完成');
        }
    }, function err(err){
        dfd.reject(err);
    })
    return dfd.promise;
}

function handle(_body, ACCESS_TOKEN, count, cursor, flag){
    var dfd = Q.defer();
    if (_body && _body.user_info_list) {
        var user_info_list = _body.user_info_list;
        var users = [];
        var _flag = 0;
        for (var i = 0; i < user_info_list.length; i++) {
            var user = user_info_list[i];
            var temp = '';
            if (user && user.nickname != null) {
                temp = "(" + user.subscribe + ",'" + user.openid + "','" + user.nickname.replace(/\\'/g, "\\\\'").replace(/\'/g, "\\\'") + "'," + user.sex + ",'" + user.language +
                    "','" + user.city.replace(/\\'/g, "\\\\'").replace(/\'/g, "\\\'") + "','" + user.province.replace(/\\'/g, "\\\\'").replace(/\'/g, "\\\'") + "','" + user.country + "','" + user.headimgurl + "'," + user.subscribe_time +
                    ",'" + user.unionid + "','" + user.remark + "'," + user.groupid + ")";
                users.push(temp);
            }
        }
        Q.all(
            users
        ).then(function resolve(res) {
                if(res.length === 0){
                    for (var i = 0; i < user_info_list.length; i++) {
                        var user = user_info_list[i];
                        var temp = "(" + user.subscribe + ",'" + user.openid + "','" + user.unionid + "'," + 1 + ")";
                        users.push(temp);
                        _flag = 1;
                    }
                    Q.all(users).then(function resolve(res){
                        return mysql.user.updateUser({flag:_flag, users:res.toString()});
                    }, function reject(err){
                        dfd.reject(err);
                    }).then(function resolve(ret) {
                        console.log('is null update ok:', ret);
                        if (!flag) {
                            dfd.resolve(ret);
                        } else {
                            cursor++;
                            scan(ACCESS_TOKEN, count, cursor);
                        }
                    }, function reject(err) {
                        dfd.reject(err);
                    })
                }else{
                    return mysql.user.updateUser({flag:_flag, users:res.toString()});
                }
            }, function reject(err) {
                dfd.reject(err);
            }).then(function resolve(ret) {
                console.log('is update ok:', ret);
                if (!flag) {
                    dfd.resolve(ret);
                } else {
                    cursor++;
                    scan(ACCESS_TOKEN, count, cursor);
                }
            }, function reject(err) {
                dfd.reject(err);
            })
    } else {
        console.log('出错，重新获取:' + JSON.stringify(_body));
        try{
            if(_body && _body.errcode == 40001){
                redis.del('access_token').then(function resolve(res) {
                    return Token.getAccessToken();
                }, function reject(err) {
                    dfd.reject(err);
                }).then(function resolve(res) {
                    if (res.access_token) {
                        cursor++;
                        scan(res.access_token, count, cursor);
                    }
                }, function err(err) {
                    dfd.reject(err);
                });
            }else{
                cursor++;
                scan(ACCESS_TOKEN, count, cursor);
            }
        }catch(err){
            cursor ++;
            scan(ACCESS_TOKEN, count, cursor);
        }
    }
    return dfd.promise;
}