'use strict';

var Q = require('q');
var path = require('path');
var _ = require('lodash');
var redis = require(path.resolve(global.gpath.app.libs + '/redis'));
var UDate = require(path.resolve(global.gpath.app.libs + '/tools/date'));

var _getPlayset = function(pid){
    var dfd = Q.defer();
    if (pid == undefined) {
        dfd.reject({
            err: 'pid is undefined'
        });
    } else {
        Q(
            redis.hgetall('playset:' + pid)
        ).then(function resolve(res) {
            var _playset = res;
            var udate = new UDate(new Date(_playset.lastModTime));

            _.extend(_playset,{
                questions: JSON.parse(_playset.questions),
                lastModTime: udate.getYmd('-') + ' ' + udate.getHms()
            });
            // console.log(_playset);
            dfd.resolve(_playset);
        }, function reject(err){
            dfd.reject({
                err: 'playset not found'
            });
        }); // end of Q
    }// end of if pid

    return dfd.promise;
};

module.exports = _getPlayset;
