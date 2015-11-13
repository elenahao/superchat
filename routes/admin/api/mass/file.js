'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var formidable = require('formidable');
var fs = require('fs');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

//页面图片传到生成项目内图片，首次生成，插入
app.post('/admin/api/mass/fileInsert',
    function(req, res) {
        console.log('/admin/api/mass/fileInsert...');
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: err
                }));
            }else {
                var time = (new Date()).getTime();
                var filename = 'cover_'+ time +'.jpg';
                var targetPath = gpath.dist.public + '/img/' + filename;
                console.log(targetPath);
                console.log(files.fileInput.path);
                fs.rename(files.fileInput.path, targetPath, function(err){
                    if(err) console.log(err);
                    fs.stat(targetPath, function (err, stat) {
                        if (err) {
                            return callback(err);
                        }
                        console.log(stat.size);
                        if(stat.size >= 2 * 1024 * 1024){//不能超过2M
                            res.status(400).send(JSON.stringify({
                                ret: -1,
                                msg: '图片大小超过2M'
                            }));
                        }
                        //将图片发送给微信，获取url地址，存库
                        Token.getAccessToken().then(function done(ret){
                            if(ret.access_token){
                                console.log('targetPath='+targetPath);
                                request({
                                    url: 'https://api.weixin.qq.com/cgi-bin/media/upload?access_token='+ret.access_token+"&type=image",
                                    formData: {
                                        media: fs.createReadStream(targetPath)
                                    },
                                    method: 'POST'
                                }, function(err, _res, body) {
                                    console.log(body);
                                    var _body = JSON.parse(body);
                                    //存mysql,insert,字段为id,thumb_media_id,cover_pic_local_url,add_time,last_update_time
                                    var msg = {
                                        thumb_media_id: _body.media_id,
                                        cover_pic_local_url: '/img/' + filename
                                    }
                                    mysql.mass.addMsg(msg).then(function done(ret){
                                        console.log('is mysql addMsg ok:', ret);
                                        res.status(200).send(JSON.stringify({
                                            ret: 0,
                                            msg: '/img/' + filename,
                                            id: ret.insertId,
                                            thumb_media_id: _body.media_id
                                        }));
                                    }, function err(err){
                                        res.status(400).send(JSON.stringify({
                                            ret: -1,
                                            msg: err
                                        }));
                                    })
                                });
                            }else{
                                console.log('access_token为空');
                                res.status(400).send(JSON.stringify({
                                    ret: -1,
                                    msg: 'access_token为空'
                                }));
                            }
                        }, function err(err){
                            res.status(400).send(JSON.stringify({
                                ret: -1,
                                msg: err
                            }));
                        })
                    });
                })
            }
        });
    });

//非首次生成，更新
app.post('/admin/api/mass/fileUpdate',
    function(req, res) {
        console.log('/admin/api/mass/fileUpdate...');
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.status(400).send(JSON.stringify({
                    ret: -1,
                    msg: err
                }));
            }else {
                var time = (new Date()).getTime();
                var filename = 'cover_'+ time +'.jpg';
                var targetPath = gpath.dist.public + '/img/' + filename;
                console.log(targetPath);
                console.log(files.fileInput.path);
                fs.rename(files.fileInput.path, targetPath, function(err){
                    if(err) console.log(err);
                    fs.stat(targetPath, function (err, stat) {
                        if (err) {
                            return callback(err);
                        }
                        console.log(stat.size);
                        if(stat.size >= 2 * 1024 * 1024){//不能超过2M
                            res.status(400).send(JSON.stringify({
                                ret: -1,
                                msg: '图片大小超过2M'
                            }));
                        }
                        //将图片发送给微信，获取url地址，存库
                        Token.getAccessToken().then(function done(ret){
                            if(ret.access_token){
                                console.log('targetPath='+targetPath);
                                request({
                                    url: 'https://api.weixin.qq.com/cgi-bin/material/add_material?access_token='+ret.access_token+"&type=thumb",
                                    formData: {
                                        media: fs.createReadStream(targetPath)
                                    },
                                    method: 'POST'
                                }, function(err, _res, body) {
                                    console.log(body);
                                    var _body = JSON.parse(body);
                                    //存mysql,insert,字段为id,thumb_media_id,cover_pic_local_url,cover_pic_url,add_time,last_update_time
                                    var msg = {
                                        id: fields.msg_id,
                                        thumb_media_id: _body.media_id,
                                        cover_pic_local_url: '/img/' + filename
                                    }
                                    mysql.mass.updateMsg(msg).then(function done(ret){
                                        console.log('is mysql addMsg ok:', ret);
                                        res.status(200).send(JSON.stringify({
                                            ret: 0,
                                            msg: '/img/' + filename,
                                            id: ret.insertId,
                                            thumb_media_id: _body.media_id
                                        }));
                                    }, function err(err){
                                        res.status(400).send(JSON.stringify({
                                            ret: -1,
                                            msg: err
                                        }));
                                    })
                                });
                            }else{
                                console.log('access_token为空');
                                res.status(400).send(JSON.stringify({
                                    ret: -1,
                                    msg: 'access_token为空'
                                }));
                            }
                        }, function err(err){
                            res.status(400).send(JSON.stringify({
                                ret: -1,
                                msg: err
                            }));
                        })
                    });
                })
            }
        });
    });