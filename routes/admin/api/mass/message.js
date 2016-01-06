'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

//根据分组群发
app.post('/admin/api/mass/group',
    function(req, res) {
        console.log('/admin/api/mass/group...');
        //var msg_id = req.body.msg_id;
        var media_id = req.body.media_id;
        var group_id = req.body.group_id;
        var opt = {
            filter: {
                is_to_all: false,
                group_id: group_id
            },
            mpnews: {
                media_id: media_id
            },
            msgtype: 'mpnews'
        }
        console.log(opt);
        function _send(){
            Token.getAccessToken().then(function done(ret) {
                if (ret.access_token) {
                    console.log(JSON.stringify(opt));
                    request({
                        url: 'https://api.weixin.qq.com/cgi-bin/message/mass/sendall?access_token='+ret.access_token,
                        body: JSON.stringify(opt),
                        method: 'POST'
                    }, function (err, _res, body) {
                        console.log(body);
                        var _body = JSON.parse(body);
                        if(_body.errcode == 0){
                            //成功
                            res.status(200).send(JSON.stringify({
                                ret: 0,
                                msg: '发送成功'
                            }));
                        }else if(_body.errcode == 40001){
                            redis.del('access_token').then(function resolve(ret) {
                                console.log('is del ok:', ret);
                                return _send();
                            }, function reject(err) {
                                res.status(400).send(JSON.stringify({
                                    ret: -1,
                                    msg: err
                                }));
                            });
                        }
                    });
                }
            }, function err(err){
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: err
                }));
            });
        }
        _send();

    });

//根据openid群发
app.post('/admin/api/mass/openid',
    function(req, res) {
        console.log('/admin/api/mass/openid...');
        //continue...
    });

