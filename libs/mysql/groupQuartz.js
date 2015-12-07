'use strict'

var Q = require('q');
var pool = require('./client');

exports.addQuartz = function (option) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        conn.query('insert into wx_group_quartz (group_id, country, province, city) values (?,?,?,?)', [option.groupid, option.country, option.province, option.city], function (err, ret) {
            if (err) {
                console.error(err);
                dfd.reject(err);
            }
            else {
                dfd.resolve(ret);
            }
            conn.release();
        })
    })
    return dfd.promise;
};

exports.getGroupNotQuartz = function () {
    console.log('in getGroupNotQuartz...');
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log('getConnection...');
        conn.query("select g.id from wx_group g where g.is_quartz=0 order by g.id", function (err, rows) {
            if(err){
                dfd.reject(err);
            }else{
                dfd.resolve(rows);
            }
            conn.release();
        });
    });
    return dfd.promise;
};

exports.getQuartzByGroupId = function (groupId) {
    console.log('in getQuartzByGroupId...');
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log('getConnection...');
        conn.query("select * from wx_group_quartz where is_quartz=0 and group_id=?", groupId, function (err, rows) {
            if(err){
                dfd.reject(err);
            }else{
                dfd.resolve(rows);
            }
            conn.release();
        });
    });
    return dfd.promise;
};

exports.queryUsersByCity = function (pageNo, pageSize, opt) {
    console.log('in queryUsersByCity...');
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log('getConnection...');
        //conn.query("select count(*) as u from wx_user where groupid!=? and country=? and province=? and city=?", [opt.group_id, opt.country, opt.province, opt.city], function (err, ret) {
        //    if (err) {
        //        dfd.reject(err);
        //    }
        //    else {
        //        var totalCount = ret[0].u;
                var totalCount = 200000;
                var totalPage = Math.ceil(totalCount / pageSize);
                if(pageNo > totalPage){
                    pageNo = totalPage;
                }
                var offset = (pageNo - 1) * pageSize;
                if(offset < 0){
                    offset = 0;
                }
                console.log('totalCount:',totalCount,';totalPage:',totalPage,'offset:',offset);
                conn.query("select t.openid from wx_user t where t.groupid!=? and t.country=? and t.province=? and t.city=? limit ?,?", [opt.group_id, opt.country, opt.province, opt.city, offset, pageSize], function (err, rows) {
                    if(err){
                        dfd.reject(err);
                    }else{
                        dfd.resolve(rows);
                    }
                    conn.release();
                });
        //    }
        //    conn.release();
        //})
    });
    return dfd.promise;
}

exports.queryUsersByProvince = function (pageNo, pageSize, opt) {
    console.log('in queryUsersByProvince...');
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
    //    console.log('getConnection...');
    //    conn.query("select count(*) as u from wx_user where groupid!=? and country=? and province=? ", [opt.group_id, opt.country, opt.province], function (err, ret) {
    //        if (err) {
    //            dfd.reject(err);
    //        }
    //        else {
    //            var totalCount = ret[0].u;
                var totalCount = 700000;
                var totalPage = Math.ceil(totalCount / pageSize);
                if(pageNo > totalPage){
                    pageNo = totalPage;
                }
                var offset = (pageNo - 1) * pageSize;
                if(offset < 0){
                    offset = 0;
                }
                console.log('totalCount:',totalCount,';totalPage:',totalPage,'offset:',offset);
                conn.query("select openid from wx_user where groupid!=? and country=? and province=? limit ?,?", [opt.group_id, opt.country, opt.province, offset, pageSize], function (err, rows) {
                    if(err){
                        dfd.reject(err);
                    }else{
                        dfd.resolve(rows);
                    }
                    conn.release();
                });
        //    }
        //    conn.release();
        //})
    });
    return dfd.promise;
}

exports.updateQuartz = function (id) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        conn.query('update wx_group_quartz set is_quartz=1 where id=? ', id, function (err, ret) {
            if (err) {
                console.error(err);
                dfd.resolve('mysql update error');
            }
            else {
                dfd.resolve(ret);
            }
            conn.release();
        })
    })
    return dfd.promise;
};

exports.updateGroup = function (id) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        conn.query('update wx_group set is_quartz=1 where id=? ', id, function (err, ret) {
            if (err) {
                console.error(err);
                dfd.resolve('mysql update error');
            }
            else {
                dfd.resolve(ret);
            }
            conn.release();
        })
    })
    return dfd.promise;
};

