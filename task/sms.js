var https = require('https');
var qs = require('querystring');
var config = require('config');

var sms_host = 'sms.yunpian.com';
var apikey = config.get('api.sms_apikey');
// 指定模板发送接口https地址
var uri = '/v2/sms/tpl_single_send.json';
// 指定发送的模板编号 【采宝通】您定制监控#type#当前已高于#num#。本条提醒信息之后，此条监控将失效
var tpl_id_h = 2442158;
// 指定发送的模板编号 【采宝通】您定制监控#type#当前已低于#num#。本条提醒信息之后，此条监控将失效
var tpl_id_l = 2442316;

var sms = {};

sms.send_ath_sms=function(mobile,tpl_value,callback){
  
    send_tpl_sms(mobile,tpl_id_h,tpl_value,callback); 
}

sms.send_atl_sms=function(mobile,tpl_value,callback){
  
    send_tpl_sms(mobile,tpl_id_l,tpl_value,callback); 
}

function send_tpl_sms(mobile,tpl_id,tpl_value,callback){
    var post_data = {  
    'apikey': apikey,
    'mobile':mobile,
    'tpl_id':tpl_id,
    'tpl_value':qs.stringify(tpl_value),  
    };//这是需要提交的数据  
    var content = qs.stringify(post_data);  
    post(uri,content,sms_host,callback); 
}

function post(uri,content,host,callback){
    var options = {  
        hostname: host,
        port: 443,  
        path: uri,  
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'  
        }  
    };

    var req = https.request(options, function (res) {  
        // console.log('STATUS: ' + res.statusCode);  
        // console.log('HEADERS: ' + JSON.stringify(res.headers));  
        res.setEncoding('utf8');  
        res.on('data', function (chunk) {  
        	var returncode=eval("("+ chunk + ")").code;
			console.log('ReturnCode: ' + returncode);  
        	(returncode==0)&&callback();
            console.log('BODY: ' + chunk);  
        });  
    }); 
    //console.log(content);
    req.write(content);  

    req.end();   
}
module.exports = sms;

