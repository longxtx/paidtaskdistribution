var express = require('express');
var router = express.Router();
var task =require('../task/task');
var ethapi =require('../chain/ethlib');

var taskobj;

router.get('/tstart', function(req, res) {
    taskobj=taskobj||task.start();
  res.send('Task Start！');
});

router.get('/tstop', function(req, res) {
    taskobj&&task.end(taskobj);
  res.send('Task Stop');
});

router.get('/eth', function(req, res) {
	var currentAccount = "0x0D7242F5B57cB052445E4CF5817d21ff9355C44E";
 ethapi.getbalance(currentAccount,function(balance){
 	 res.send('eth:'+balance);
 })
 
});

module.exports = router;

