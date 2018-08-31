var Geetest = require('gt3-sdk');
var config = require('config');

var captcha = new Geetest({
    geetest_id:config.get('api.geetest_id'),
    geetest_key:config.get('api.geetest_key')
});

module.exports = captcha;