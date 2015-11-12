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
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

// 调用微信接口获取公众号的所有组
app.get('/admin/api/group/refresh', function(req, res) {
    var dfd = Q.defer();
    console.log("admin group refresh ...");
    Token.getAccessToken().then(function resolve(res) {
        var ACCESS_TOKEN = '';
        if(res.access_token){
            console.log(res.access_token);
            ACCESS_TOKEN = res.access_token;
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
                    var groups = [];
                    for(var i = 0; i< data.groups.length;i++){
                        if(data.groups[i]){
                            var group = "(" + data.groups[i].id + ",'" + data.groups[i].name + "'," + data.groups[i].count + ")";
                            groups.push(group);
                        }
                    }
                    Q.all(
                        groups
                    ).then(function resolve(res) {
                            return mysql.group.updateGroup(res.toString());
                        }, function reject(err) {
                            dfd.reject(err);
                        }).then(function resolve(ret) {
                            console.log('is update ok:', ret);
                            dfd.resolve(ret);
                        }, function reject(err) {
                            dfd.reject(err);
                        })
                }
            });
        }
    },function reject(err){
        res.status(400).send(JSON.stringify({
            ret: -4,
            msg: err
        }));
    })
    res.redirect('/admin/group');
});