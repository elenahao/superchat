/**
 * Created by elenahao on 15/9/17.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));
var Group = require(path.resolve(global.gpath.app.model + '/common/group'));

app.get('/admin/api/search/group/name/:gname',
    function(req, res) {
        var _gname = req.params.gname;
        console.log('gname:'+_gname);
        var _start = !_.isNaN(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? parseInt(req.query.count) : 20;
        var countries = {};
        mysql.area.findAllCountries().then(function done(ret){
            countries = ret;
            return Group.pagingQueryByName(_start, _count, _gname);
        }, function err(err){
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: err
            }));
        })
        .then(function done(ret) {
            var _pages = ret.totalPage;
            var _now = _start;
            res.status(200).send(JSON.stringify({
                ret: 0,
                data: {
                    countries: countries,
                    groups: ret.groups,
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