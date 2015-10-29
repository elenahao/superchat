'use strict'

var path = require('path');
var Q = require('q');
var request = require('request');
var Lazy = require('lazy.js');
var _ = require('lodash');

var _nav = require(path.resolve(global.gpath.app.model + '/admin/pages/sitenav')).getSiteNav();

_nav.mass.isActive = true;

app.get(['/admin/massMessage'],
    function(req, res, next) {
        console.log("admin massMessage...");

        res.render('admin/massMessage', {
            title: "Wechat管理后台",
            adminStaticBase: global.adminStaticBase,
            csrf: res.locals._csrf,
            sitenavs: _nav//传到页面后，左侧菜单栏根据isActive点亮或变灰
        });
    });
