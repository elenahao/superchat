'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var Lazy = require('lazy.js');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var getPlaysets = require('./gets');

var playsets = {};

function _getAllPlayset(){
    var dfd = Q.defer();
    redis.get('allps').then(function done(allps){
        dfd.resolve(JSON.parse(allps));
    },function err(err){
        scan().then(function(res){
            var p = [];
            Lazy(res).each(function(value,key){
                p.push(value);
            });
            if(Lazy(p).isEmpty()){
                dfd.resolve([]);
            }
            getPlaysets(p).then(function done(ps){
                redis.set('allps', JSON.stringify(ps));
                redis.client.expire('allps', 20);
                dfd.resolve(ps);
            },function err(err){
                dfd.reject(err);
            });
        });
    });

    return dfd.promise;
}

function scan() {
    var dfd = Q.defer();
    var cursor = '0';
    playsets = {};
    function _scan(){
        redis.client.scan(
            cursor,
            'match', 'playset:*',
            'count', '1000',
            function(err, res) {
                cursor = res[0];
                if(res[1].length > 0){
                    Lazy(res[1]).each(function(pid){
                        playsets[pid] = pid.split(':')[1];
                    });
                }

                if (cursor == 0) {
                    dfd.resolve(playsets);
                } else {
                    _scan();
                }
            }
        );
    }
    _scan();

    return dfd.promise;
}

module.exports = _getAllPlayset;
