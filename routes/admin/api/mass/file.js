'use strict';
var path = require('path');
var Q = require('q');
var Lazy = require('lazy.js');
var _ = require('lodash');
var request = require('request');
var formidable = require('formidable');
var fs = require('fs');

//页面图片传到生成项目内图片
app.post('/admin/api/mass/fileUpload',
    function(req, res) {
        console.log('/admin/api/mass/fileUpload...');
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.status(500).send(JSON.stringify({
                    ret: -1,
                    msg: err
                }));
            }else {
                var time = (new Date()).getTime();
                var filename = 'cover_'+ time +'.jpg';
                var targetPath = gpath.dist.public + '/img/' + filename;
                console.log(targetPath);
                console.log(files.fileInput.path);
                fs.renameSync(files.fileInput.path, targetPath);
                res.status(200).send(JSON.stringify({
                    ret: 0,
                    msg: '/img/' + filename
                }));
            }
        });
    });