var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var arrange = require('./routes/arrange');
var app = express();


var identityKey = 'skey';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    name: identityKey,
    secret: 'ifptd',  // 用来对session id相关的cookie进行签名
    store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    saveUninitialized: true,  // 是否自动保存未初始化的会话，建议false
    resave: false,  // 是否每次都重新保存会话，建议false
    cookie: {
        maxAge: 300 * 1000  // 有效期，单位是毫秒
    }
}));

//登录拦截器  /^\/gt\/
app.use(function (req, res, next) {
    var url = req.originalUrl;
    console.log("url:"+url+" User:"+req.session.loginUser+"isgt:"+url.search("/gt/"));
    if (url.search("\/register")<0 &&url.search("\/login")<0 &&url != "/"&&url != "/tologin" && url.search("\/gt\/")<0 && !req.session.loginUser) {
         console.log('is Logout!');
        return res.redirect('/');
    }
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/api', api);
app.use('/arrange', arrange);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
}); 

app.listen(3000);

module.exports = app;
