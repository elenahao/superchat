/**
 * Created by elenahao on 15/9/17.
 */

'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var Group = require(path.resolve(global.gpath.app.model + '/common/group'));

app.get('/admin/api/search/group/name/:gname',
    function(req, res) {
        var _gname = req.params.gname;
        var _start = !_.isNaN(parseInt(req.query.start)) ? parseInt(req.query.start) : 0;
        var _count = !_.isNaN(parseInt(req.query.count)) ? parseInt(req.query.count) : 20;
        console.log('_start', _start);
        var countries = {};
        mysql.area.findAllCountries().then(function done(result){
            countries = result;
            return Group.pagingQueryByName(_start, _count, _gname);
        }, function err(err){
            res.status(400).send(JSON.stringify({
                ret: -1,
                msg: err
            }));
        })
            .then(function done(result) {
                var _pages = result.totalPage;
                var _now = _start;
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