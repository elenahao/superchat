'use strict';

var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

app.get('/admin/api/group/delete/:gid',
    function(req, res, next){
        //var dfd = Q.defer();
        console.log('admin api group delete-to-wechat ... ');
        console.log('gid='+req.params.gid);
        var _gid = req.params.gid;
        if (_gid) {
            //{"group":{"id":108}}
            //先获取ACCESS_TOKEN
            var ACCESS_TOKEN = '';
            Token.getAccessToken().then(function resolve(ret) {
                if(ret.access_token){
                    console.log(ret.access_token);
                    ACCESS_TOKEN = ret.access_token;
                    ACCESS_TOKEN = ret.access_token;
                    console.log('_gid='+_gid);
                    var group = {
                        id: _gid
                    }
                    console.log(JSON.stringify(group));
                    request({url: 'https://api.weixin.qq.com/cgi-bin/groups/delete?access_token='+ACCESS_TOKEN,
                        method: 'POST',
                        body: JSON.stringify({group: group})
                    }, function (err, _res, body){
                        console.log('is request get ok:', body);
                        mysql.group.delGroup(_gid).then(function resolve(ret){
                            console.log('is del group ok:', ret);
                            res.status(200).send(JSON.stringify({
                                ret: 0
                            }));
                        }, function reject(err){
                            res.status(400).send(JSON.stringify({
                                ret: err
                            }));
                        })
                    });
                }
            },function reject(err){
                res.status(400).send(JSON.stringify({
                    ret: err
                }));
            })
        } else {
            res.status(400).send(JSON.stringify({
                ret: -1
            }));
        }
    });

