/**
 * Created by elenahao on 15/10/14.
 */

'use strict'

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
app.get('/admin/api/getInfo/user_attach', function(req, res) {
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
            ret: -1,
            msg: err
        }));
    })
});

function scan(ACCESS_TOKEN) {
    var dfd = Q.defer();
    function _scan(ACCESS_TOKEN){
        var body = '';
        console.log(body);
        //存入redis
        try {
            var _body = JSON.parse(body);
            var user_info_list = _body.user_info_list;
            var users = [];
            for (var i = 0; i < user_info_list.length; i++) {
                var user = user_info_list[i];
                var temp = '';
                if (user && user.nickname) {
                    console.log(user.nickname);
                    temp = "(" + user.subscribe + ",'" + user.openid + "','" + user.nickname + "'," + user.sex + ",'" + user.language +
                        "','" + user.city + "','" + user.province + "','" + user.country + "','" + user.headimgurl + "'," + user.subscribe_time +
                        ",'" + user.unionid + "','" + user.remark + "'," + user.groupid + ")";
                    console.log('temp='+temp);
                    users.push(temp);
                }
            }
            Q.all(
                users
            ).then(function resolve(res) {
                    return mysql.user.updateUser(res.toString());
                }, function reject(err) {
                    dfd.reject(err);
                }).then(function resolve(res) {
                    console.log('is update ok:', res);
                }, function reject(err) {
                    dfd.reject(err);
                })
        } catch (err) {
            console.log(err);
        }
    }
    _scan(ACCESS_TOKEN);

    return dfd.promise;
}
