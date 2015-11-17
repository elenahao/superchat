'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));

app.post(['/admin/api/group/addQuarz'],
    function(req, res, next){
        console.log('admin api group addQuarz ... ');
        console.log('gid='+req.body.gid);
        console.log('country='+req.body.country);
        console.log('province='+req.body.province);
        console.log('city='+req.body.city);
        console.log('sex='+req.body.sex);
        console.log('subscribe_start='+req.body.subscribe_start);
        console.log('subscribe_end='+req.body.subscribe_end);
        req.sanitize('gid').trim();
        req.sanitize('gid').escape();
        //验证
        req.checkBody('gid', 'empty').notEmpty().isInt();
        var errors = req.validationErrors();
        console.log('err:',errors);

        if (errors) {
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: errors
            }));
        } else {
            var _gid = req.body.gid;
            var _country = req.body.country;
            var _province = req.body.province;
            var _city = req.body.city;
            var _sex = req.body.sex;
            var _subscribe_start = req.body.subscribe_start == undefined ? '' : (new Date(req.body.subscribe_start)).getTime();
            var _subscribe_end = req.body.subscribe_end == undefined ? '' : (new Date(req.body.subscribe_end)).getTime();

            var options = {
                groupid: _gid,
                country: _country,
                province: _province,
                city: _city,
                sex: _sex,
                subscribe_start: _subscribe_start,
                subscribe_end: _subscribe_end
            }
            mysql.group.addQuartz(options)
                .then(function resolve(ret){
                    console.log('is addQuartz ok:', ret);
                },function reject(err){
                    res.status(400).send(JSON.stringify({
                        ret: -1,
                        msg: err
                    }));
                })
        }
        res.redirect('/admin/group');
    });

