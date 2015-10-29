/**
 * Created by elenahao on 15/9/9.
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

app.post(['/admin/api/group/edit'],
    function(req, res, next){
        console.log('admin api group edit-to-wechat ... ');
        console.log('gname='+req.body.gname);
        console.log('gid='+req.body.gid);
        req.sanitize('gname').trim();
        req.sanitize('gname').escape();
        req.sanitize('gid').trim();
        req.sanitize('gid').escape();
        //验证
        req.checkBody('gname', 'empty').notEmpty();
        req.checkBody('gid', 'empty').notEmpty().isInt();
        var errors = req.validationErrors();
        console.log('err:',errors);

        if (errors) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: errors
            }));
        } else {
            var _gname = req.body.gname;
            var _gid = req.body.gid;
            if (_gname && _gid) {
                //{"group":{"id":108,"name":"test2_modify2"}}
                //先获取ACCESS_TOKEN
                var ACCESS_TOKEN = '';
                Token.getAccessToken().then(function resolve(ret) {
                    if(ret.access_token){
                        console.log(ret.access_token);
                        ACCESS_TOKEN = ret.access_token;
                        console.log(ret.access_token);
                        console.log('_gname='+_gname);
                        console.log('_gid='+_gid);
                        var group = {
                            id: _gid,
                            name: _gname
                        }
                        console.log(JSON.stringify(group));
                        request({url: 'https://api.weixin.qq.com/cgi-bin/groups/update?access_token='+ACCESS_TOKEN,
                            method: 'POST',
                            body: JSON.stringify({group: group})
                        }, function (err, _res, body){
                            //{"errcode": 0, "errmsg": "ok"}
                            var _body = JSON.parse(body);
                            if(_body.errcode == 0){
                                mysql.group.updateGroupName(group).then(function resolve(ret){
                                    console.log('is updateGroupName ok:', ret);
                                    res.status(200).send(JSON.stringify({
                                        ret: 0
                                    }));
                                }, function reject(err){
                                    res.status(400).send(JSON.stringify({
                                        ret: -1,
                                        msg: err
                                    }));
                                })
                            }else{
                                res.status(400).send(JSON.stringify({
                                    ret: body.errcode,
                                    msg: body.errmsg
                                }));
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
                    msg: err
                }));
            }
        }
    });

