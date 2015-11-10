/**
 * Created by elenahao on 15/9/8.
 */

'use strict';

var _app = {
    APPID: 'wx453d1b8e59f33e94',
    SECRET: '29a0c75c81f484e645aa080ae94d454b',
    token: 'haoxueying123',
    encodingAESKey: 'fIHFCBxqaVU9ZFXuFdLw8u67Q3H2Ey4BSRyuGo9hpqM',
    URL: 'http://haoxueying.qiuxiansheng.com/wechat',
    OPENID: 'gh_22e5bf3e552f'
}

//var _apptest = {
//    APPID: 'wx0c7c93d636ff9769',
//    SECRET: 'd4a38c7b7804febf8c33045005713191',
//    token: 'haoxueying123',
//    URL: 'http://haoxueying.qiuxiansheng.com/wechat',
//    OPENID: 'gh_be215938378a'
//}

//var _apptest = {
//    APPID: 'wx92f2c0782c597fd0',
//    SECRET: 'aaa416b2022c855b841eaeba1e68e8a8'
//}

//var _apptest = {
//    APPID: 'wxf43562ffba270399',
//    SECRET: 'd4624c36b6795d1d99dcf0547af5443d'
//}
var _apptest = {
    APPID: 'wxacb9ce1b1d812430',
    SECRET: 'bcd4b0fd8742414548bb66a16ff34a26'
}


var wechatConf = {
    app: _app,
    apptest: _apptest
};

module.exports = wechatConf;