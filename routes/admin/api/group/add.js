'use strict';

var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

app.post(['/admin/api/group/add'],
    function(req, res, next){
        console.log('admin api group add-to-wechat ... ');
        req.sanitize('gname').trim();
        req.sanitize('gname').escape();
        //验证
        req.checkBody('gname', 'empty').notEmpty();
        var errors = req.validationErrors();

        if (errors) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: errors
            }));
        } else {
            var _gname = req.body.gname;
            if (_gname) {
                //先获取ACCESS_TOKEN
                var ACCESS_TOKEN = '';
                Token.getAccessToken().then(function resolve(ret) {
                    if(ret.access_token){
                        ACCESS_TOKEN = ret.access_token;
                        console.log(ret.access_token);
                        console.log('_gname='+_gname);
                        var group = {
                            name: _gname
                        }
                        console.log(JSON.stringify(group));
                        request({url: 'https://api.weixin.qq.com/cgi-bin/groups/create?access_token='+ACCESS_TOKEN,
                            method: 'POST',
                            body: JSON.stringify({group: group})
                        }, function (err, _res, body){
                            console.log('is request get ok:', body);
                            if(!err){
                                var _body = JSON.parse(body);
                                if(typeof _body.group === 'undefined'){
                                    res.status(400).send(JSON.stringify({
                                        ret: -1,
                                        msg: body
                                    }));
                                }else{
                                    var _g = _body.group;
                                    mysql.group.addGroup(_g).then(function resolve(ret){
                                        console.log('is group add ok:', ret);
                                        res.status(200).send(JSON.stringify({
                                            ret: 0
                                        }));
                                    }, function reject(err){
                                        res.status(400).send(JSON.stringify({
                                            ret: -1,
                                            msg: err
                                        }));
                                    });
                                }
                            }
                        });
                    }
                },function reject(err){
                    res.status(400).send(JSON.stringify({
                        ret: -1,
                        msg: err
                    }));
                })
            } else {
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: errors
                }));
            }
        }
    });

