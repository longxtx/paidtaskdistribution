var schedule = require('node-schedule');
var sms = require('./sms');
var gateapi = require('../chain/gate');
var MongoDB =require('../database/db');
var task = {};

var rule = new schedule.RecurrenceRule();
rule.second = [30,59];

task.start=function(){

  console.log('Task Start',new Date());
  return schedule.scheduleJob(rule, function(){
    console.log('现在时间：',new Date());

    var queryall={status:{$ne :9}};
    (function(){
         MongoDB.find('t_arrange_data',queryall, function (err, arranges) {
                    if(arranges){
                          console.log('arranges：::'+arranges);
                          arranges.forEach(function(item){
                              gateapi.get_price(item.type_str,function(price) {
                                     console.log('price:::::'+price);
                                    if(price>=item.price_h)
                                    {
                                      sms.send_ath_sms(item.user_phone,{'#type#':item.type_str.substring(0,4),'#num#':item.price_h},function(){
                                         console.log("大于"+item.price_h);
                                         changestatus(item._id);
                                        });
                                      

                                    }else if(price<=item.price_l){
                                          sms.send_atl_sms(item.user_phone,{'#type#':item.type_str.substring(0,4),'#num#':item.price_l},function(){
                                         console.log("大于"+item.price_h);
                                         changestatus(item._id);
                                        });
                                      
                                    }
                              });
                          });                        
                      
                    }else{
                        console.log("Task arranges failed in " + new Date());
                    }
                });

        })(queryall);



     
  });

}

task.end=function(taskobj){

 taskobj.cancel();
 console.log('Task End',new Date());

}

function changestatus(aid)
{
  var changedata={_id:aid};
  var setdata={status:9};
   (function(){
         MongoDB.update('t_arrange_data',changedata,setdata,function (err, rdata) {
              if(rdata){
                console.log('Change Status Ok！'+rdata);
                }else{
                  console.log('Change Status failed！'+err);
                }

          });

    })(changedata,setdata);
}

module.exports = task;


// 每分钟的第30秒触发： '30 * * * * *'

// 每小时的1分30秒触发 ：'30 1 * * * *'

// 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'

// 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'

// 2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'

// 每周1的1点1分30秒触发 ：'30 1 1 * * 1'


