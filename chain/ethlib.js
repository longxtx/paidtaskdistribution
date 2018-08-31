var Web3 = require('web3');
var config = require('config');
var ethapi = {},web3;

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    
	// 连接到自有以太坊节点
	//web3 = new Web3(new Web3.providers.HttpProvider("http://domin:8545"));
	// 连接到以太坊主网节点
	web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/"+config.get('api.infura_key')));
}


// 合约ABI
var abi = [{"constant":false,"inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"name":"sendCoin","outputs":[{"name":"sufficient","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"}];

// //查询主帐号
// // var coinbase = web3.eth.coinbase;
// // console.log(coinbase);



ethapi.getbalance=function(Account,callback){
	// wei是以太坊上的的最小单位，ether小数点后18位为一个wei
	var balanceWei = web3.eth.getBalance(currentAccount).toNumber();
		 (function(){
		 	console.log(currentAccount+'：'+balanceWei);
	 	return callback(web3.fromWei(balanceWei, 'ether'));
	 })(balanceWei)

}


module.exports = ethapi;







// var i=1000;


// // 以太币转账
// new Promise((resolve)=> {
// 		resolve(web3.eth.sendTransaction({
// 	    from: accounts[1],
// 	    to: accounts[3],
// 	    value: 3000000000000000000
// 		}));
// 	}).then(function(receipt){
//   	  console.log(receipt);
// 	}).then(()=>{


// 			accounts.map(function(account){

// 			// Promise.resolve(web3.eth.getBalance(account)/1e18).then((data)=>{
// 			// 	console.log("Data:"+data)
// 			// });

// 			 new Promise((resolve)=> {
// 					setTimeout(function () {
// 					      	resolve(web3.eth.getBalance(account)/1e18);
// 					      },i--);
// 				}).then((data)=>{
// 						console.log("Data:"+data)
// 				});

// 			});

// 	});





