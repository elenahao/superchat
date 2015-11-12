'use strict'

var Q = require('q');
var pool = require('./client');

exports.addMsg = function (msg) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        conn.query('insert into wx_mass_msg(thumb_media_id, cover_pic_local_url, add_time, last_update_time) values (?,?,now(),now())', [msg.thumb_media_id, msg.cover_pic_local_url], function (err, ret) {
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

exports.updateMsg = function (msg) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        conn.query('replace into wx_mass_msg(id, thumb_media_id, cover_pic_local_url, cover_pic_url, last_update_time) values (?,?,?,?,now())', [msg.id, msg.thumb_media_id, msg.cover_pic_local_url, msg.cover_pic_url], function (err, ret) {
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


exports.queryThumbById = function (id) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        conn.query(' select thumb_media_id from wx_mass_msg where id=? ', id, function (err, ret) {
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

exports.saveMsg = function (msg) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        conn.query('update wx_mass_msg set author=?, title=?, content=?, digest=?, show_cover_pic=?, media_id=?, media_created_time=FROM_UNIXTIME(?) where id=? ', [msg.author, msg.title, msg.content, msg.digest, msg.show_cover_pic, msg.media_id, msg.media_created_time, msg.id], function (err, ret) {
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

exports.updateMsgAfterPosted = function (msg) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        conn.query('update wx_mass_msg set msg_posted_id=?, msg_data_id=? where id=? ', [msg.msg_posted_id, msg.msg_data_id, msg.id], function (err, ret) {
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

exports.updateMsgItem = function (items) {
    var dfd = Q.defer();
    pool.getConnection(function (err, conn) {
        conn.query('insert into wx_mass_msg_item (id,mass_msg_id, title, content, show_cover_pic, author, content_source_url, last_update_time) values '+items.toString()+
            ' on duplicate key update id=values(id), mass_msg_id=values(mass_msg_id), title=values(title), content=values(content), show_cover_pic=values(show_cover_pic), author=values(author), content_source_url=values(content_source_url), last_update_time=values(last_update_time); ',  function (err, ret) {
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