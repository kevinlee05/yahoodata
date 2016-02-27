var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var assert = require('assert');
var Converter = require("csvtojson").Converter;
var dlFuncs = require('./scripts/downloadFunctions');
var getAllSymbols = require('./scripts/getAllSymbols')
var Q = require('q');


getAllSymbols().then(function(data){
	console.log(data);
})


