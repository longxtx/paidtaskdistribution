var express = require('express');
var router = express.Router();
var moment = require('moment');
var MongoDB =require('../database/db');

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

/*sdduser*/
router.get('/add', function(req, res) {
    var add_doc = {name: 'long', password: '123',user_phone:'18676366166',create_time:moment().format('YYYYMMDDHHmmss'),update_time:moment().format('YYYYMMDDHHmmss')};
    (function(){

        MongoDB.save('t_userinfo', add_doc, function (err, doc) {
                if(doc == 1){
                    console.log(add_doc.name + ": Save success in " + new Date());
                     res.render('ucenter', { user:doc });
                }else{
                    console.log(add_doc.name + ": login failed in " + new Date());
                    res.redirect('/');
                }
            });
  
    })(add_doc);
});


/*sdduser*/
router.get('/q', function(req, res) {
    var user_id = '5b7f7062e5b65b5114f74f0d';
    (function(){

        MongoDB.findById('t_userinfo', user_id, function (err, doc) {
                
                    console.log('User:'+doc);
                    res.redirect('/');
             
            });
  
    })(user_id);
});


module.exports = router;
