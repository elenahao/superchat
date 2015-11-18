//'use strict'
//var schedule = require("node-schedule");
//var path = require('path');
//var Q = require('q');
//var Lazy = require('lazy.js');
//var _ = require('lodash');
//var request = require('request');
//var User = require(path.resolve(global.gpath.app.model + '/common/user'));
//var Token = require(path.resolve(global.gpath.app.model + '/common/token'));
//
////定时设为一天跑一次
//var rule = new schedule.RecurrenceRule();
//rule.dayOfWeek = [0, new schedule.Range(1, 6)];
//rule.hour = 2;//每周每天半夜2点整开始跑
//rule.minute = 0;
//
//var j = schedule.scheduleJob(rule, function(){
//    var dfd = Q.defer();
//    //1-取一个未跑定时的组（按组号orderby）
//    //2-取这个组下需要跑的用户，分组分quartz取，一次取该quartz的50个
//    //3-每次将这50个数据进行update
//    //4-全部更新成功后，将对应的is_quartz改为1，再重复从2开始
//    //5-如果全部quartz更新完，就将这个组的is_quartz改为1，再重复从1开始
//    //6-如果全部组更新完，over
//    var groupId = 0;
//    mysql.groupQuartz.getGroupNotQuartz().then(function done(ret){
//        if(ret.length > 0){
//            //取到了一个未跑定时的组
//            groupId = ret.id;
//            return mysql.groupQuartz.getQuartzByGroupId(groupId);
//        }else{
//            //已经没有未跑定时的组了，可以结束了
//            console.log('group update over...');
//            dfd.resolve('group update over...');
//        }
//    }, function err(err){
//        dfd.reject({err: err});
//    }).then(function done(ret){
//        if(ret){
//            var quartz_array = [];
//            for(var i = 0; i < ret.length; i++){
//                var quartz = ret[i];
//                mysql.groupQuartz.queryUsersByCondition(i, 50, quartz).then(function done(ret){
//                    _request(ret);
//                }, function err(err){
//                    dfd.reject({err: err});
//                })
//                //根据quartz的条件，查询出50个，调用_request()
//
//                quartz_array.push(quartz);
//            }
//            Q.all(quartz_array).then(function done(ret){
//                //更新group表将is_quartz改为1
//            }, function err(err){
//                dfd.reject({err: err});
//            })
//        }else{
//            //更新group表将is_quartz改为1
//        }
//    }, function err(err){
//        dfd.reject({err: err});
//    })
//
//});
//
//var _request = function(options){
//    var dfd = Q.defer();
//    var ACCESS_TOKEN = '';
//    Token.getAccessToken().then(function resolve(res) {
//        if (res.access_token) {
//            for (var i = 0; i < options.length; i++) {
//                //{"openid_list":["oDF3iYx0ro3_7jD4HFRDfrjdCM58","oDF3iY9FGSSRHom3B-0w5j4jlEyY"],"to_groupid":108}
//                //先获取ACCESS_TOKEN
//                var opt = options[i];
//                console.log(res.access_token);
//                console.log('options=', JSON.stringify(opt));
//                ACCESS_TOKEN = res.access_token;
//                request({
//                    url: 'https://api.weixin.qq.com/cgi-bin/groups/members/batchupdate?access_token=' + ACCESS_TOKEN,
//                    method: 'POST',
//                    body: JSON.stringify(opt)
//                }, function (err, res, body) {
//                    console.log('is request get ok:', body);
//                });
//            }
//        }
//    }, function reject(err) {
//        dfd.reject({err: err});
//    })
//}
//
//var _handle = function(scheduals, users){
//    var dfd = Q.defer();
//    var options = [];
//    for (var i = 0; i < scheduals.length; i++) {
//        console.log('scheduals.length='+scheduals.length);
//        var schedual = scheduals[i];
//        var us_openid = [];
//        console.log('us_openid:',us_openid);
//        console.log('user=' + users);
//        for (var j = 0; j < users.length; j++) {
//            console.log('users.length='+users.length);
//            var user = users[j];
//            if (!user) {
//                continue;
//            }
//            if (_validator(schedual, user)) {
//                console.log('***************success=' + user.openid);
//                us_openid.push(user.openid);
//            } else {
//                continue;
//            }
//        }
//        var opt = {
//            openid_list: us_openid,
//            to_groupid: schedual.to_groupid
//        }
//        options.push(opt);
//    }
//    return options;
//}
//
//var _validator = function(schedual, user){
//    console.log('schedual---------------', schedual.country);
//    var country_val = schedual.country;
//    console.log('schedual------', schedual.province);
//    var province_val = schedual.province;
//    console.log('schedual------', schedual.city);
//    var city_val = schedual.city;
//    console.log('schedual------', schedual.sex);
//    var sex_val = schedual.sex;
//    console.log('schedual------', schedual.subscribe_start);
//    var subscribe_start_val = schedual.subscribe_start;
//    console.log('schedual------', schedual.subscribe_end);
//    var subscribe_end_val = schedual.subscribe_end;
//    var to_groupid_val = schedual.to_groupid;
//    console.log('to_groupid=' + to_groupid_val);
//    var flag1 = false;
//    var flag2 = false;
//    var flag3 = false;
//    var flag4 = false;
//    var flag5 = false;
//    var flag6 = false;
//    if (typeof country_val === 'undefined') {
//        flag1 = true;
//    } else {
//        if (user.country === country_val) {
//            flag1 = true;
//        } else {
//            flag1 = false;
//        }
//    }
//    if (typeof province_val === 'undefined') {
//        flag2 = true;
//    } else {
//        if (user.province === province_val) {
//            flag2 = true;
//        } else {
//            flag2 = false;
//        }
//    }
//    if (typeof city_val === 'undefined') {
//        flag3 = true;
//    } else {
//        if (user.city === city_val) {
//            flag3 = true;
//        } else {
//            flag3 = false;
//        }
//    }
//    if (typeof sex_val === 'undefined') {
//        flag4 = true;
//    } else {
//        if (user.sex === sex_val) {
//            flag4 = true;
//        } else {
//            flag4 = false;
//        }
//    }
//    if (typeof subscribe_start_val === 'undefined') {
//        flag5 = true;
//    } else {
//        if (parseInt(user.subscribe_time) >= parseInt(subscribe_start_val)) {
//            flag5 = true;
//        } else {
//            flag5 = false;
//        }
//    }
//    if (typeof subscribe_end_val === 'undefined') {
//        flag6 = true;
//    } else {
//        if (parseInt(user.subscribe_time) <= parseInt(subscribe_end_val)) {
//            flag6 = true;
//        } else {
//            flag6 = false;
//        }
//    }
//    console.log(flag1 && flag2 && flag3 && flag4 && flag5 && flag6);
//    return flag1 && flag2 && flag3 && flag4 && flag5 && flag6;
//}