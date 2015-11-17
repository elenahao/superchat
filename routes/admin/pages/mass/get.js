'use strict'

var path = require('path');
var Q = require('q');
var request = require('request');
var Lazy = require('lazy.js');
var _ = require('lodash');
var Group = require(path.resolve(global.gpath.app.model + '/common/group'));

var _nav = require(path.resolve(global.gpath.app.model + '/admin/pages/sitenav')).getSiteNav();

_nav.mass.isActive = true;

app.get(['/admin/mass'],
    function(req, res, next) {
        console.log("admin mass...");
        var msg_id = req.query.msg_id;
        var media_id = req.query.media_id;
        Group.all().then(function done(ret){
            res.render('admin/mass', {
                title: "Wechat管理后台",
                adminStaticBase: global.adminStaticBase,
                csrf: res.locals._csrf,
                sitenavs: _nav,
                msg_id: msg_id,
                media_id: media_id,
                groups: ret
            });
        }, function err(err){
            res.render('admin/mass', {
                title: "Wechat管理后台",
                adminStaticBase: global.adminStaticBase,
                csrf: res.locals._csrf,
                sitenavs: _nav,
                msg_id: msg_id,
                media_id: media_id
            });
        })

    });

app.get(['/admin/massMessage'],
    function(req, res, next) {
        console.log("admin massMessage...");
        res.render('admin/massMessage', {
            title: "Wechat管理后台",
            adminStaticBase: global.adminStaticBase,
            csrf: res.locals._csrf,
            sitenavs: _nav
        });
    });
