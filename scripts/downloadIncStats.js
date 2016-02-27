var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var dlFuncs = require('./downloadFunctions');



var mongoUrl = 'mongodb://localhost:27017/yahoodata';

var tickers = [];

MongoClient.connect(mongoUrl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");

  dlFuncs.getSymbols(db,'STI')
  	.then(function(symbolArray){
  		symbolArray.forEach(function(elm){
  			// set 3rd parameter to true for annual statements
  			dlFuncs.downloadIncStatement(elm, true)
  				.then(function(incStatArray){
  					// edit $set statement for quarterly or annual
		  			db.collection('STI')
							.findOneAndUpdate({symbol:elm}, {$set: {annualIncStat: incStatArray}})
							.then(function(doc){
								console.log(doc);
							});  					
  				}) //then
  		})
  	});

});


