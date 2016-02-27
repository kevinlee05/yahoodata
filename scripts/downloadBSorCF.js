var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var assert = require('assert');
var dlFuncs = require('./downloadFunctions');

var SheetUrl = 'https://sg.finance.yahoo.com/q/cf?s=';

var mongoUrl = 'mongodb://localhost:27017/yahoodata';

var tickers = [];

MongoClient.connect(mongoUrl, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  var count = 0;

  dlFuncs.getSymbols(db,'STI')
  	.then(function(symbolArray){
  		symbolArray.forEach(function(elm){
  			// set 3rd parameter to true for annual statements
  			dlFuncs.downloadBSorCF(elm, SheetUrl, true)
  				.then(function(statArray){
  					// edit $set statement for quarterly or annual
		  			db.collection('STI')
							.findOneAndUpdate({symbol:elm}, 
									{$set: {annualCashFlow: statArray}})
							.then(function(doc){
								count += 1;
								console.log(doc);
								console.log('document number ' + count);
								if(count == 30){
									db.close();
								}
							});  					
  				}) //then
  		})
  	});

});




