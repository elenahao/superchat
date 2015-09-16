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

app.post(['/admin/api/group/nickname'],
    function(req, res, next){
        console.log('admin api group nickname-group ... ');
        console.log('gnickname='+req.body.gnickname);
        console.log('gid='+req.body.gid);
        req.sanitize('gnickname').trim();
        req.sanitize('gnickname').escape();
        req.sanitize('gid').trim();
        req.sanitize('gid').escape();
        //验证
        req.checkBody('gnickname', 'empty').notEmpty();
        req.checkBody('gid', 'empty').notEmpty().isInt();
        var errors = req.validationErrors();
        console.log('err:',errors);

        if (errors) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: errors
            }));
        } else {
            var _gnickname = req.body.gnickname;
            var _gid = req.body.gid;
            var options = {
                nickname: _gnickname
            }
            var dic = new Array('country', 'province', 'city', 'sex', 'subscribe');
            var obj = {};
            var array = new Array();
            array = _gnickname.split(':')[1].split('-');
            for(var i = 0; i < array.length; i++){
                if(array[i] == '*'){
                    continue;
                }else{
                    obj[dic[i]] = array[i];
                }
            }
            if (_gnickname && _gid) {
                redis.hmset('group:'+_gid, options)
                    .then(function resolve(res){
                        console.log('is hmset ok:', res);
                        return redis.hmset('schedual-user:'+_gid, obj);
                    }, function reject(err){
                        res.status(400).send(JSON.stringify({
                            ret: -1,
                            msg: err
                        }));
                    })
                    .then(function resolve(res){
                        console.log('is hmset ok:', res);
                    },function reject(err){
                        res.status(400).send(JSON.stringify({
                            ret: -1,
                            msg: err
                        }));
                    })
            } else {
                res.status(400).send(JSON.stringify({
                    ret: -1
                }));
            }
        }
        res.redirect('/admin/group');
    });

