'use strict'

var Q = require('q');
var pool = require('./client');

exports.findGroupsByPage = function (pageNo, pageSize) {
    console.log('in findGroupsByPage...');
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log('getConnection...');
        conn.query("select count(*) as g from wx_group", function (err, ret) {
            if (err) {
                dfd.reject(err);
            }
            else {
                var totalCount = ret[0].g;
                var totalPage = Math.ceil(totalCount / pageSize);
                if(pageNo > totalPage){
                    pageNo = totalPage;
                }
                var offset = (pageNo - 1) * pageSize;
                if(offset < 0){
                    offset = 0;
                }
                console.log('totalCount:',totalCount,';totalPage:',totalPage,'offset:',offset);
                conn.query("select g.id id, g.name name, g.count count, CONCAT_WS('#', q.country, q.province, q.city, q.sex, FROM_UNIXTIME(q.subscribe_start), FROM_UNIXTIME(q.subscribe_end)) nickname from wx_group g left join wx_group_quartz q on g.id = q.group_id limit ?,?", [offset, pageSize], function (err, rows) {
                    if(err){
                        dfd.reject(err);
                    }else{
                        console.log(JSON.stringify({totalCount:totalCount, totalPage:totalPage, groups:rows}));
                        dfd.resolve({totalCount:totalCount, totalPage:totalPage, groups:rows});
                    }
                });
            }
            conn.release();
        })
    });
    return dfd.promise;
};

exports.findGroupByName = function (pageNo, pageSize, gname) {
    console.log('in findGroupsByName...');
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log('getConnection...');
        conn.query("select count(*) as g from wx_group where name=?", gname, function (err, ret) {
            if (err) {
                dfd.reject(err);
            }
            else {
                var totalCount = ret[0].g;
                var totalPage = Math.ceil(totalCount / pageSize);
                if(pageNo > totalPage){
                    pageNo = totalPage;
                }
                var offset = (pageNo - 1) * pageSize;
                if(offset < 0){
                    offset = 0;
                }
                console.log('totalCount:',totalCount,';totalPage:',totalPage,'offset:',offset);
                conn.query("select g.id id, g.name name, g.count count, g.nickname nickname from wx_group g where name=? limit ?,?", [gname, offset, pageSize], function (err, rows) {
                    if(err){
                        dfd.reject(err);
                    }else{
                        console.log(JSON.stringify({totalCount:totalCount, totalPage:totalPage, groups:rows}));
                        dfd.resolve({totalCount:totalCount, totalPage:totalPage, groups:rows});
                    }
                });
            }
            conn.release();
        })
    });
    return dfd.promise;
};

exports.findAllGroups = function () {
    console.log('in findAllGroups...');
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log('getConnection...');
        conn.query("select g.* from wx_group g", function (err, rows) {
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

exports.addGroup = function (group) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log(group);
        conn.query('insert into wx_group (id,name,count) values (?,?,?)', [group.id, group.name, 0], function (err, ret) {
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

exports.updateGroup = function (groups) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log('--'+groups+'--');
        if(groups && groups != ''){
            conn.query('replace into wx_group (id,name,count) values '+groups, function (err, ret) {
                if (err) {
                    console.error(err);
                    dfd.reject(err);
                }
                else {
                    dfd.resolve(ret);
                }
                conn.release();
            })
        }else{
            conn.release();
            dfd.resolve('null data');
        }
    })
    return dfd.promise;
};

exports.delGroup = function (gid) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        console.log(gid);
        conn.query('delete from wx_group where id=?', [gid], function (err, ret) {
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

exports.updateGroupName = function (group) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        if(group){
            conn.query('update wx_group set name=? where id=?',[group.name,group.id], function (err, ret) {
                if (err) {
                    console.error(err);
                    dfd.reject(err);
                }
                else {
                    dfd.resolve(ret);
                }
                conn.release();
            })
        }else{
            conn.release();
            dfd.resolve('null data');
        }
    })
    return dfd.promise;
};
