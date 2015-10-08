'use strict';

var _mysql = {
    client: require('./mysql/client'),
    user: require('./mysql/user'),
    group: require('./mysql/group')
}

if (global.devMode) {
    _mysql.testClient = require('./mysql/client');
}

module.exports = _mysql
