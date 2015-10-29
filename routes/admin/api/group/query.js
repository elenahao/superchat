'use strict';

var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));
var Group = require(path.resolve(global.gpath.app.model + '/common/group'));

// 获取指定分页和个数的组
app.get('/admin/api/group',
    function(req, res) {
        console.log('/admin/api/group', req.query.start, req.query.count);

        var _start = !_.isNaN(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? parseInt(req.query.count) : 20;
        console.log('_start', _start);
        var countries = {};
        mysql.area.findAllCountries().then(function done(result){
            countries = result;
            return Group.pagingQuery(_start, _count);
        }, function err(err){
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: err
            }));
        })
        .then(function done(result) {
            console.log(result);
            console.log('group='+result.groups);
            var _pages = result.totalPage;
            console.log(_pages);
            console.log('_start', _start);
            var _now = _start;
            console.log(_now);
            res.status(200).send(JSON.stringify({
                ret: 0,
                data: {
                    countries: countries,
                    groups: result.groups,
                    page: _pages,
                    now: _now,
                    start: _start,
                    count: _count
                }
            }));

        }, function err(err) {

            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: err
            }));

        });
    });