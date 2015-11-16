'use strict';

var path = require('path');
var mysql = require(path.resolve(global.gpath.app.libs + '/mysql'));

//获取三级菜单城市，根据省份province
app.post('/admin/api/area/findCityByProvince',
    function(req, res) {
        console.log('/admin/api/area/findCityByProvince...');
        var province = req.body.province;
        mysql.area.findCityByProvince(province).then(function done(cities) {
            console.log(cities);
            res.status(200).send(JSON.stringify({
                ret: 0,
                data: cities
            }));
        }, function err(err) {
            res.status(200).send(JSON.stringify({
                ret: -1,
                msg: err
            }));
        });
    });