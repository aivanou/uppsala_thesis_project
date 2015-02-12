
var request = require('request')
var json = require('json');


var name = 'default'

process.on('message', function(msg) {
	name = msg.name
	var url = msg.url
	var timeout = msg.timeout
	var nrequests = msg.nrequests
	var options = {
		url: url,
    	headers: {
    	    'User-Agent': 'request',
	        'If-None-Match': '\"111\"'
	        // 'Cache-Control':'public, max-stale=100',
	        // 'If-Modified-Since:': 'Wed, 01 Sep 2004 13:24:52 GMT'
    	}
  	};

 	makeRequest(options, sleep, timeout, nrequests)
});


function makeRequest(options, sleepFunction, timeout, nrequests){
	if(nrequests==0){
		sendFeedbackAndExit({status:'finished',name:name})
	}
	else {
		var start = Date.now()
		request(options, function(err, response, body){
			var responseTime = Date.now() - start
			console.log(name + "  response time: "+ responseTime+"; code: "+response.statusCode+"; body: "+JSON.stringify(body))
			console.log(name+"  "+JSON.stringify(response.headers, null, 4))
			sleepFunction(timeout, makeRequest, options, nrequests-1)
		})
	}
}

function sendFeedbackAndExit(message){
	process.send(message)
	process.exit()
}

function getOrDefault(lst, value, df) {
	var ind = lst.indexOf(value)
	if(ind!=-1)
		return lst[ind+1]
	return df
}

function sleep(timeout, callback, options, nrequests){
	var stop = new Date().getTime();
    while(new Date().getTime() < stop + timeout) {
        ;
    }
    callback(options, sleep, timeout, nrequests)
}
