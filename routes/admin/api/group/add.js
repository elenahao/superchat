'use strict';

var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

app.post(['/admin/api/group/add'],
    function(req, res, next){
        var dfd = Q.defer();
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
                Token.getAccessToken().then(function resolve(res) {
                    if(res.access_token){
                        ACCESS_TOKEN = res.access_token;
                        console.log(res.access_token);
                        console.log('_gname='+_gname);
                        var group = {
                            name: _gname
                        }
                        console.log(JSON.stringify(group));
                        request({url: 'https://api.weixin.qq.com/cgi-bin/groups/create?access_token='+ACCESS_TOKEN,
                            method: 'POST',
                            body: JSON.stringify({group: group})
                        }, function (err, res, body){
                            console.log('is request get ok:', body);
                            if(!err){
                                var _body = JSON.parse(body);
                                if(typeof _body.group === 'undefined'){
                                    res.status(400).send(JSON.stringify({
                                        ret: -4,
                                        msg: body
                                    }));
                                }else{
                                    var _g = _body.group;
                                    var temp = '(' + _g.id + ',' + _g.name + ',' + _g.count + ')';
                                    mysql.group.updateGroup(temp).then(function resolve(res){
                                        console.log('is group add ok:', res);
                                        dfd.resolve(res);
                                    }, function reject(err){
                                       dfd.reject(err);
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
            res.redirect('/admin/group');
        }
    });

