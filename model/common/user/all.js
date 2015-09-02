'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var getUsers = require('./getsAttachRank');

var users = {};

var _getAllUser = function() {
    var dfd = Q.defer();
    redis.get('allus').then(function done(allus){
        //先从缓存中读取，如果存在直接返回
        dfd.resolve(JSON.parse(allus));
    },function err(err){
        zscan().then(function(res){
            var u = [];
            console.log('res==='+res);
            Lazy(res).each(function(key, value){
                console.log('key='+key+',value='+value);
                var options = {
                    uid : key,
                    rank : value
                }
                u.push(options);
            });
            console.log('u='+JSON.stringify(u));
            if(Lazy(u).isEmpty()){
                dfd.resolve([]);
            }else{
                console.log('start---');
                getUsers(u).then(function done(us){
                    redis.set('allus', JSON.stringify(us));
                    redis.client.expire('allus', 20);
                    console.log('allus='+JSON.stringify(us));
                    dfd.resolve(us);
                },function err(err){
                    dfd.reject(err);
                });
            }
        });
    });

    return dfd.promise;
}

function zscan() {
    var dfd = Q.defer();
    //cursor初始为0，从头遍历
    var cursor = '0';
    users = {};
    var usersUid = {};
    function _zscan(){
        console.log('in zscan...');
        redis.client.zscan(
            'rank',
            cursor,
            //'match', 'user:*',
            'count', '1000',
            function(err, res) {
                console.log('in 回调');
                //SCAN 命令每次被调用之后， 都会向用户返回一个新的游标，
                //用户在下次迭代时需要使用这个新游标作为 SCAN 命令的游标参数， 以此来延续之前的迭代过程。
                //返回值格式：res[0] = cursor = 下一次遍历的开始index ; res[1] = "user:1","user:2"...
                cursor = res[0];
                console.log(res);
                if(res[1].length > 0){
                    var _rank = res[1];
                    console.log('_rank==='+_rank);
                    for(var i = 0;i < _rank.length; i++){
                        //usersUid[_rank[i]] = _rank[i];
                        //users[_rank[i]].uid = _rank[i];
                        //users[_rank[i]].rank = _rank[i+1];
                        console.log(i+'='+_rank[i]);
                        users[_rank[i]] = _rank[i+1];
                        i++;
                    }
                    //Lazy(res[1]).each(function(uid){
                    //    console.log('uid='+uid);
                    //    users[uid] = uid.split(':')[1];
                    //});
                    //console.log(res[1]);
                }
                //当 SCAN 命令的游标参数被设置为 0 时， 服务器将开始一次新的迭代，
                //而当服务器向用户返回值为 0 的游标时， 表示迭代已结束
                if (cursor == 0) {
                    dfd.resolve(users);
                    console.log('=============================');
                } else {
                    _zscan();
                }
            }
        );
    }
    _zscan();

    return dfd.promise;
}

module.exports = _getAllUser;
