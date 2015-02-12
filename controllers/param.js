var express = require('express');
var router = express.Router();

var nresps = 0;

var jsonData = JSON.stringify({test:"testsr"})

router.get('/', function(req, res, next){
	console.log(JSON.stringify(req.headers, null, 4))
	res.contentType('application/json');
	res.setHeader('Cache-Control', 'public, max-age=200');
	// res.setHeader('Cache-Control', 'must-revalidate, max-age=2');
	// res.setHeader('Cache-Control', 'private, max-age=2');
	// res.setHeader('Cache-Control', 'public, max-age=2');

	// res.setHeader('Cache-Control', 'no-cache, max-age=20');
	
	// var timeout = 5000
	// var stop = new Date().getTime();
 //    while(new Date().getTime() < stop + timeout) {
 //        ;
 //   }
   if(req.query.newjson){
		console.log("new is set to: "+req.query.newjson)
		if(req.query.newjson=='true'){
			jsonData = generateRandomJson()
		}
	}
    // res.setHeader('Last-Modified', new Date().toUTCString());
	// res.setHeader('Expires:','Mon, 25 Jun 2016 21:31:12 GMT') 
	// res.setHeader("Content-Type", "text/json");
	res.send(jsonData);
});

router.get('/:p', function(req, res, next){
	res.contentType('application/json');
	res.send(JSON.stringify({test:req.params.p}));
});


function generateRandomJson(){
	return JSON.stringify({test:randomString(10)})
}

function randomString(length){
	var str = ""
	for(var i=0;i<length;++i){
		str+=randomNumber(0,10)
	}
	return str
}

function randomNumber(low, high){
	return Math.floor(Math.random()*(high-low)+low)
}

module.exports = router;
