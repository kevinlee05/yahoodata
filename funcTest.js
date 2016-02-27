var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var assert = require('assert');
var Converter = require("csvtojson").Converter;
var dlFuncs = require('./scripts/downloadFunctions');

var cashFlowUrl = 'https://sg.finance.yahoo.com/q/cf?s=';
var balSheetUrl = 'https://sg.finance.yahoo.com/q/bs?s=';


var mongoUrl = 'mongodb://localhost:27017/yahoodata';

var tickers = [];



dlFuncs.downloadHistoricalPrices('O23.SI')
	.then(function(data){
		console.log(typeof(data));

	});




