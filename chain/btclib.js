var MyWallet = require('blockchain.info/MyWallet')
var https = require('https');
var btcapi = {};




//init wallet object
// var options = { apiCode:config.get('api.blockchain_apicode'), apiHost: config.get('api.blockchain_apiHost') };
// var wallet = new MyWallet(config.get('api.btc_guid'), config.get('api.btc_name'), options);
// //show balance
// wallet.getBalance().then(function (balance) { console.log('Wallet balance is %d!', balance); });



btcapi.getbalance=(account,callback)=>{

		https.get('https://blockchain.info/q/addressbalance/'+account, (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	  	return callback(data);
	  });
	}).on('error', (e) => {
	  console.log('Got error:'+e.message);
	});
};

btcapi.getticker=(callback)=>{

	https.get('https://blockchain.info/ticker', (resp) => {
	  let data = '';
	  resp.on('data', (chunk) => {
	    data += chunk;
	  });
	  resp.on('end', () => {
	  	console.log(data);
	  	return callback(JSON.parse(data).USD.last);
	  });
	}).on('error', (e) => {
	  console.log('Got error:'+e.message);
	});

}


module.exports = btcapi;

btcapi.getbalance('1933phfhK3ZgFQNLGSDXvqCn32k2buXY8a',(blance)=>{
	console.log('blance:'+blance/1e8);
});

btcapi.getticker((last)=>{
	console.log('BTC　last:'+last);
});

