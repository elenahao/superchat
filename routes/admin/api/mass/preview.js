'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

//预览
app.post('/admin/api/mass/preview',
    function(req, res) {
        console.log('/admin/api/mass/preview...');
        var params = req.body.params;
        _preview(res, params);
    });

function _preview(res, _params){
    console.log('_params', JSON.stringify(_params));
    Token.getAccessToken().then(function done(ret) {
        if (ret.access_token) {
            var ACCESS_TOKEN = ret.access_token;
            var art = [];
            for(var i = 0 ; i < _params.length ; i ++){
                var opt;
                if(_params[i].digest){
                    opt = {
                        title: _params[i].title,
                        thumb_media_id: _params[i].thumb_media_id,
                        author: _params[i].author,
                        digest: _params[i].digest,
                        show_cover_pic: _params[i].show_cover_pic,
                        content: _params[i].content,
                        content_source_url: _params[i].content_source_url
                    }
                }else{
                    opt = {
                        title: _params[i].title,
                        thumb_media_id: _params[i].thumb_media_id,
                        author: _params[i].author,
                        show_cover_pic: _params[i].show_cover_pic,
                        content: _params[i].content,
                        content_source_url: _params[i].content_source_url
                    }
                }
                art.push(opt);
            }
            console.log(JSON.stringify({articles: art}));
            request({
                url: 'https://api.weixin.qq.com/cgi-bin/media/uploadnews?access_token='+ACCESS_TOKEN,
                body: JSON.stringify({articles: art}),
                method: 'POST'
            }, function(err, _res, body) {
                var _body = JSON.parse(body);
                console.log(_body);
                console.log(_body.media_id);
                console.log(_body.created_at);
                if(_body.errcode && _body.errcode == 40001){
                    redis.del('access_token').then(function resolve(ret) {
                        console.log('is del ok:', ret);
                        return _preview(res, params);
                    }, function reject(err) {
                        res.status(200).send(JSON.stringify({
                            ret: -1,
                            msg: err
                        }));
                    });
                }else if(_body.errcode && _body.errcode == 45009){
                    res.status(200).send(JSON.stringify({
                        ret: -1,
                        msg: JSON.stringify(_body)
                    }));
                }else{
                    if(_body.media_id && _body.created_at){
                        var msg = {
                            id: _params[0].msg_id,
                            author: _params[0].author,
                            title: _params[0].title,
                            content: _params[0].content,
                            digest: _params[0].digest,
                            show_cover_pic: _params[0].show_cover_pic,
                            media_id: _body.media_id,
                            media_created_time: _body.created_at
                        }
                        mysql.mass.saveMsg(msg).then(function done(ret){
                            console.log('is mysql save msg ok:', ret);
                            if(_params.length > 1){
                                var items = [];
                                for(var j = 1 ; j < _params.length; j ++){
                                    var item = "(" + _params[j].id + "," + _params[0].msg_id + ",'" +
                                        _params[j].title + "','" + _params[j].content + "'," +
                                        _params[j].show_cover_pic + ",'" + _params[j].author + "','" +
                                        _params[j].content_source_url + "', now())";
                                    items.push(item);
                                }
                                Q.all(items).then(function done(ret){
                                    return mysql.mass.updateMsgItem(ret);
                                }, function err(err){
                                    res.status(400).send(JSON.stringify({
                                        ret: -1,
                                        msg: err
                                    }));
                                }).then(function done(ret){
                                    console.log('is updateMsgItem ok:', ret);
                                }, function err(err){
                                    res.status(400).send(JSON.stringify({
                                        ret: -1,
                                        msg: err
                                    }));
                                })
                            }
                            //调用微信预览接口
                            var pre = {
                                towxname: 'haoxueying',
                                mpnews: {
                                    media_id: _body.media_id
                                },
                                msgtype: 'mpnews'
                            }
                            console.log('pre:', JSON.stringify(pre));
                            request({
                                url: 'https://api.weixin.qq.com/cgi-bin/message/mass/preview?access_token='+ACCESS_TOKEN,
                                body: JSON.stringify(pre),
                                method: 'POST'
                            }, function(err, _res, body) {
                                console.log(body);
                                var _pre_body = JSON.parse(body);
                                if(_pre_body.errcode == 0){
                                    mysql.mass.updatePreviewedMsg(_params[0].msg_id, 'haoxueying').then(function done(ret){
                                        console.log('is update MsgId ok:', ret);
                                        res.status(200).send(JSON.stringify({
                                            ret: 0,
                                            msg: '预览并保存成功',
                                            id: _params[0].msg_id,
                                            media_id: _body.media_id
                                        }));
                                    }, function err(err){
                                        res.status(400).send(JSON.stringify({
                                            ret: -1,
                                            msg: err
                                        }));
                                    })
                                }else{
                                    res.status(400).send(JSON.stringify({
                                        ret: -1,
                                        msg: body
                                    }));
                                }
                            });
                        }, function err(err){
                            res.status(400).send(JSON.stringify({
                                ret: -1,
                                msg: err
                            }));
                        })
                    }
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
