var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var assert = require('assert');
var dlFuncs = require('./downloadFunctions');

var incStUrl = 'https://sg.finance.yahoo.com/q/is?s=';

var mongoUrl = 'mongodb://localhost:27017/yahoodata';

var tickers = [];

MongoClient.connect(mongoUrl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");

  dlFuncs.getSymbols(db,'STI')
  	.then(function(symbolArray){
  		symbolArray.forEach(function(elm){
  			// set 3rd parameter to true for annual statements
  			dlFuncs.downloadIncStatement(elm, incStUrl, true)
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


