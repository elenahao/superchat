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
        var msg_id = req.query.msg_id;
        var media_id = req.query.media_id;
        var group_id = req.query.group_id;
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
                            var msg_posted_id = _body.msg_id;
                            var msg_data_id = _body.msg_data_id;
                            var msg = {
                                msg_posted_id: msg_posted_id,
                                is_to_all: 0,
                                msg_data_id: msg_data_id,
                                id: msg_id
                            }
                            //存库
                            mysql.mass.updateMsgAfterPosted(msg).then(function done(ret){
                                console.log('is updateMsgAfterPosted ok:', ret);
                                res.status(200).send(JSON.stringify({
                                    ret: 0,
                                    msg: '发送成功'
                                }));
                            }, function err(err){
                                res.status(400).send(JSON.stringify({
                                    ret: -1,
                                    msg: err
                                }));
                            })
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

