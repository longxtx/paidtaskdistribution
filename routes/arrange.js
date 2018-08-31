var express = require('express');
var moment = require('moment');
var router = express.Router();
var MongoDB =require('../database/db');

/* GET home page. */
router.get('/', function(req, res) {


    res.render('arrange', {
            name: req.session.loginUser || ''
    });

    // if(!!req.session.loginUser)
    // {
        
    // }
    // else
    // {
    //       console.log( "User is logout " + new Date());
    //       res.redirect('/');
    // }
    
});

/*login*/
router.get('/list', function(req, res) {

    var querybyuser={status:{$ne :9},user_id:req.session.loginUserid||''};
    (function(){
         MongoDB.find('t_arrange_data',querybyuser, function (err, doc) {
                    if(doc){
                          console.log('arranges：::'+doc);
                          res.render('arrange_list', { name: req.session.loginUser || '',arranges:doc });      
                      
                    }else{
                        console.log(querybyuser.user_id + ": login failed in " + new Date());
                        res.redirect('/');
                    }
                });

        })(querybyuser);

    
});

router.get('/toadd', function(req, res) {
    res.render('arrange_add', {name:req.session.loginUser || '',
                                uid:req.session.loginUserid||'',
                        uphone:req.session.loginUserphone||'' });
});

/*ucenter*/
router.post('/add', function(req, res) {
    var arrangeinfo = { user_id:req.body.user_id, 
                        user_phone: req.body.user_phone,
                        type_str:req.body.type_str,
                        price_h:req.body.price_h,
                        price_l:req.body.price_l,
                        status:1,
                        create_time:moment().format('YYYYMMDDHHmmss'),
                        update_time:moment().format('YYYYMMDDHHmmss')
                      };
    (function(){

       MongoDB.save('t_arrange_data', arrangeinfo, function (err, doc) {
                if(doc == 1){
                    console.log(arrangeinfo.user_phone + ": Save success in " + new Date());
                     res.render('ucenter', { user:doc });
                }else{
                    console.log(arrangeinfo.user_phone + ": login failed in " + new Date());
                    res.redirect('/');
                }
            });
  
    })(arrangeinfo);
});


module.exports = router;

