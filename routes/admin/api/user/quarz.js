/**
 * Created by elenahao on 15/9/7.
 */

var schedule = require("node-schedule");
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var User = require(path.resolve(global.gpath.app.model + '/common/user'));
var Token = require(path.resolve(global.gpath.app.model + '/common/token'));

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 14;
rule.minute = 04;

var j = schedule.scheduleJob(rule, function(){
    //SCAN获取所有的schedual定时
    var dfd = Q.defer();
    var scheduals = [];
    var users = [];
    User.schedual().then(function done(res) {
        Lazy(res).each(function(_res) {
            scheduals.push(_res);
        });
        return User.all();
    }, function err(err) {
        dfd.reject({err: err});
    })
    .then(function done(res) {
        Lazy(res).each(function(_res) {
            users.push(_res);
        });
        return _handle(scheduals, users);
    }, function err(err) {
        dfd.reject({err: err});
    })
    .then(function done(res) {
        console.log('is handle ok:', res);
        return _request(res);
    }, function err(err) {
        dfd.reject({err: err});
    })
    .then(function done(res) {
        console.log('is request ok:', res);
        dfd.resolve(res);
    }, function err(err) {
        dfd.reject({err: err});
    })

});

var _request = function(options){
    var dfd = Q.defer();
    var ACCESS_TOKEN = '';
    Token.getAccessToken().then(function resolve(res) {
        if (res.access_token) {
            for (var i = 0; i < options.length; i++) {
                //{"openid_list":["oDF3iYx0ro3_7jD4HFRDfrjdCM58","oDF3iY9FGSSRHom3B-0w5j4jlEyY"],"to_groupid":108}
                //先获取ACCESS_TOKEN
                var opt = options[i];
                console.log(res.access_token);
                console.log('options=', JSON.stringify(opt));
                ACCESS_TOKEN = res.access_token;
                request({
                    url: 'https://api.weixin.qq.com/cgi-bin/groups/members/batchupdate?access_token=' + ACCESS_TOKEN,
                    method: 'POST',
                    body: JSON.stringify(opt)
                }, function (err, res, body) {
                    console.log('is request get ok:', body);
                });
            }
        }
    }, function reject(err) {
        dfd.reject({err: err});
    })
}

var _handle = function(scheduals, users){
    var dfd = Q.defer();
    var options = [];
    for (var i = 0; i < scheduals.length; i++) {
        console.log('scheduals.length='+scheduals.length);
        var schedual = scheduals[i];
        var us_openid = [];
        console.log('us_openid:',us_openid);
        console.log('user=' + users);
        for (var j = 0; j < users.length; j++) {
            console.log('users.length='+users.length);
            var user = users[j];
            if (!user) {
                continue;
            }
            if (_validator(schedual, user)) {
                console.log('***************success=' + user.openid);
                us_openid.push(user.openid);
            } else {
                continue;
            }
        }
        var opt = {
            openid_list: us_openid,
            to_groupid: schedual.to_groupid
        }
        options.push(opt);
    }
    return options;
}

var _validator = function(schedual, user){
    console.log('schedual---------------', schedual.country);
    var country_val = schedual.country;
    console.log('schedual------', schedual.province);
    var province_val = schedual.province;
    console.log('schedual------', schedual.city);
    var city_val = schedual.city;
    console.log('schedual------', schedual.sex);
    var sex_val = schedual.sex;
    console.log('schedual------', schedual.subscribe);
    var subscribe_val = schedual.subscribe;
    var to_groupid_val = schedual.to_groupid;
    console.log('to_groupid=' + to_groupid_val);
    var flag1 = false;
    var flag2 = false;
    var flag3 = false;
    var flag4 = false;
    var flag5 = false;
    if (typeof country_val === 'undefined') {
        flag1 = true;
    } else {
        if (user.country === country_val) {
            flag1 = true;
        } else {
            flag1 = false;
        }
    }
    if (typeof province_val === 'undefined') {
        flag2 = true;
    } else {
        if (user.province === province_val) {
            flag2 = true;
        } else {
            flag2 = false;
        }
    }
    if (typeof city_val === 'undefined') {
        flag3 = true;
    } else {
        if (user.city === city_val) {
            flag3 = true;
        } else {
            flag3 = false;
        }
    }
    if (typeof sex_val === 'undefined') {
        flag4 = true;
    } else {
        if (user.sex === sex_val) {
            flag4 = true;
        } else {
            flag4 = false;
        }
    }
    if (typeof subscribe_val === 'undefined') {
        flag5 = true;
    } else {
        if (user.subscribe === subscribe_val) {
            flag5 = true;
        } else {
            flag5 = false;
        }
    }
    console.log(flag1 && flag2 && flag3 && flag4 && flag5);
    return flag1 && flag2 && flag3 && flag4 && flag5;
}