

var cp = require('child_process');

function forkChildren(nchildren, script){
	var clients = []
	for(var i=0;i<nclients;++i){
		var client = cp.fork(__dirname + '/'+script);
		clients[i]=client
	}
	return clients
}

function broadcast(clients, message){
	for(var i=0;i<clients.length;++i){
		message.name = 'child '+(i+1)
		clients[i].send(message)
	}
}

var finishedChildren = 0

function asyncListen(clients, callback){
	for(var i=0;i<clients.length;++i){
		clients[i].on('message', function(m) {
	  		console.log('Child: ', m.name+" , status: Finished");
			finishedChildren++;
			if(finishedChildren == clients.length){
				callback();
			}
		});
	}
}

function exit(){
	console.log('work finished, exiting');
	process.exit();
}

var url = getOrDefault(process.argv, '-u','http://localhost:6081/param?newjson=false')
var nreq = getOrDefault(process.argv, '-r', 10)
var timeout = getOrDefault(process.argv, '-t', 1000)
var nclients = getOrDefault(process.argv, '-c', 1)

console.log('number of clients: '+nclients)
console.log("connecting to: " + url)
console.log("number or requests: " + nreq)
console.log('timeout between requests:  ' + timeout);

var message = {url:url, timeout:timeout, nrequests:nreq}


var clients = forkChildren(nclients, 'restClient.js')
asyncListen(clients, exit)
broadcast(clients, message)



function getOrDefault(lst, value, df) {
	var ind = lst.indexOf(value)
	if(ind!=-1)
		return lst[ind+1]
	return df
}

