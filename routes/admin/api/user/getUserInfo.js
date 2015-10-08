/**
 * Created by elenahao on 15/9/7.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var http = require('http');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));
var User = require(path.resolve(global.gpath.app.model + '/common/user'));

// 调取微信接口获取用户的详细信息
app.get('/admin/api/getInfo/user', function(req, res) {
    console.log("admin userInfo get...");
    var ACCESS_TOKEN = '';
    Token.getAccessToken().then(function resolve(res) {
        if(res.access_token){
            console.log(res.access_token);
            ACCESS_TOKEN = res.access_token;
            //从redis获取所有用户openid scan 每次获取100
            scan(ACCESS_TOKEN);
        }
    },function reject(err){
        res.status(400).send(JSON.stringify({
            ret: -4,
            msg: err
        }));
    })
    res.redirect('/admin/user');
});

function scan(ACCESS_TOKEN) {
    var dfd = Q.defer();
    var count = 10000;
    var cursor = 0;
    function _scan(ACCESS_TOKEN){
        User.getOpenidByPage(cursor, count).then(function done(openids){
            console.log('ACCESS_TOKEN='+ACCESS_TOKEN);
            var url = 'https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token='+ACCESS_TOKEN+'&user_list='+JSON.stringify(openids);
            console.log(url);
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token='+ACCESS_TOKEN,//+'&user_list='+JSON.stringify({user_list: user_list}),
                body: JSON.stringify({user_list: openids}),
                method: 'POST'
            }, function(err, res, body) {
                if(err) console.log(err);
                console.log('======'+body);
                if (res.statusCode === 200) {
                    console.log('success');
                    //存入redis
                    var _body = JSON.parse(body);
                    console.log(_body);
                    var user_info_list = _body.user_info_list;
                    for(var i = 0; i< user_info_list.length; i++){
                        var user = user_info_list[i];
                        //var openid = user.openid;
                        mysql.user.updateUser(user)
                            .then(function resolve(res) {
                                console.log('is update ok:', res);
                            }, function reject(err) {
                                dfd.reject(err);
                            })
                    }
                }
                if (openids.length != count) {
                    dfd.resolve(res);
                } else {
                    cursor++;
                    _scan(ACCESS_TOKEN);
                }
            });
        }, function err(err){
            dfd.reject(err);
        })
    }
    _scan(ACCESS_TOKEN);

    return dfd.promise;
}