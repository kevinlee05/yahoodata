var request = require('request');
var cheerio = require('cheerio');
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var assert = require('assert');
var dlFuncs = require('./downloadFunctions');

var cashFlowUrl = 'https://sg.finance.yahoo.com/q/cf?s=';

var mongoUrl = 'mongodb://localhost:27017/yahoodata';

var tickers = [];



downloadBalanceSheet('U14.SI', cashFlowUrl, false);




function downloadBalanceSheet(ticker, cashFlowUrl, annualBool){

	return new Promise(function(resolve,reject){
		var url = ''

		// concatenate url and ticker depending on annual parameter
		if(annualBool) {
			var url = cashFlowUrl + ticker + '&annual';
		} else {
			var url = cashFlowUrl + ticker;
		}

		request(url, function(error, response, html){

			if(error){
				console.log(error);
			} else {
				console.log('html loaded for ' + ticker);
				var $ = cheerio.load(html);

				// intialize data arrays
				var statArray = []; 
				var periodarray = [];

				//collect period headings
				$('td.yfnc_modtitle1').each(function(i, elm){
					periodarray.push($(this).text().trim());
				});

				// push period ending headings as first item of each inc statement document
				for (var i = 1; i < 5; i++) {
					var docObj = {};
					docObj[periodarray[0]] = moment(periodarray[i], 'DD MMM, YYYY').toDate();
					statArray.push(docObj);
				}

				$('td.yfnc_modtitle1').parent().siblings()
				.each(function(i,elm){
					var textArray = [];

					// push table row data into a text array
					$(this).children().each(function(i, elm){
						var text = $(this).text().trim();
						//only if not empty string
						if (text != '') {
							textArray.push(text);
						}

					});

					// push line item onto each income statement document
					if (textArray.length != 0) {
						for (var i = 0; i< 4; i++) {
							statArray[i][textArray[0]]= textArray[i+1];
						}			
					}

				});

				console.log(statArray);
			}			

		})

	})

}


