var express = require('express');
var router = express.Router();
var MongoDB =require('../database/db');
var Geetest = require('./geet');


var identityKey = 'skey';

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'index' });
});

/*login*/
router.get('/login', function(req, res) {
    res.render('login', { title: 'login' });
});

/*ucenter*/
router.post('/ucenter', function(req, res) {

            console.log('in.....'+req.body.username);
    

             var query_doc = {name: req.body.username, password: req.body.password};
            (function(){

                MongoDB.findOne('t_userinfo', query_doc, function (err, doc) {
                        if(doc){

                            req.session.regenerate(function(err) {
                                if(err){
                                    console.log(query_doc.name + ": login failed (Session failed) " + new Date());
                                    res.redirect('/');              
                                }
                                req.session.loginUser = query_doc.name;
                                req.session.loginUserid=doc._id;
                                req.session.loginUserphone=doc.user_phone;
                                console.log(query_doc.name +"【" +doc.user_phone+"】: login success in " + new Date());
                                res.render('ucenter', { user:query_doc.name });                        
                            });

                          
                        }else{
                            console.log(query_doc.name + ": login failed in " + new Date());
                            res.redirect('/');
                        }
                    });
          
                 })(query_doc);
       
   
});


router.get("/gt/register", function (req, res) {

    // 向极验申请每次验证所需的challenge
    Geetest.register(null, function (err, data) {
        if (err) {
            console.error(err);
            res.status(500);
            res.send(err);
            return;
        }

        if (!data.success) {
            // 进入 failback，如果一直进入此模式，请检查服务器到极验服务器是否可访问
            // 可以通过修改 hosts 把极验服务器 api.geetest.com 指到不可访问的地址

            // 为以防万一，你可以选择以下两种方式之一：

            // 1. 继续使用极验提供的failback备用方案
            req.session.fallback = true;
            res.send(data);

            // 2. 使用自己提供的备用方案
            // todo

        } else {
            // 正常模式
            req.session.fallback = false;
            res.send(data);
        }
    });
});
router.post("/gt/validate", function (req, res) {
    // 对ajax提供的验证凭证进行二次验证
    Geetest.validate(req.session.fallback, {
        geetest_challenge: req.body.geetest_challenge,
        geetest_validate: req.body.geetest_validate,
        geetest_seccode: req.body.geetest_seccode
    }, function (err, success) {

        if (err) {
            // 网络错误
            res.send({
                status: "error",
                info: err
            });

        } else if (!success) {

            // 二次验证失败
            res.send({
                status: "fail",
                info: '登录失败'
            });
        } else {

            res.send({
                status: "success",
                info: '登录成功'
            });
        }
    });
});
// 退出登录
router.get('/logout', function(req, res, next){
    // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
    // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
    // 然后去查找对应的 session 文件，报错
    // session-file-store 本身的bug    
    req.session.destroy(function(err) {
        if(err){
            res.json({ret_code: 2, ret_msg: '退出登录失败'});
            return;
        }
        // req.session.loginUser = null;
        res.clearCookie(identityKey);
        res.redirect('/');
    });
});


module.exports = router;

/**
//先包含进来
var MongoDB = require('./mongodb');

//查询一条数据
MongoDB.findOne('user_info', {_id: user_id}, function (err, res) {
    console.log(res);
});

//查询多条数据
MongoDB.find('user_info', {type: 1}, {}, function (err, res) {
    console.log(res);
});

//更新数据并返回结果集合
MongoDB.updateData('user_info', {_id: user_info._id}, {$set: update_data}, function(err, user_info) {
      callback(null, user_info);
});

//删除数据
MongoDB.remove('user_data', {user_id: 1});

**/
