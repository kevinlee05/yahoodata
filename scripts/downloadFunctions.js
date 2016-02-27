var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var assert = require('assert');
var Converter = require("csvtojson").Converter;
var Q = require('q')

exports.getArrayOfAllSymbols = function(db, collectionName) {
	return new Promise(function(resolve){
	  var cursor = db.collection(collectionName)
	  					.find({},{_id:0, symbol:1})
	  					.toArray(function(err, documents){
	  						// db.close();
	  						var symbolArray = documents.map(function(elm){
	  							return elm.symbol;
	  						});
	  						resolve(symbolArray);
	  					});

	});

};

exports.downloadHistoricalPrices = function(ticker){

	return new Promise(function(resolve, reject){
		var urlFront = "http://real-chart.finance.yahoo.com/table.csv?s="
		var urlBack = "&d=1&e=27&f=2016&g=d&a=7&b=1&c=2000&ignore=.csv"
		var url = urlFront + ticker + urlBack;

		var converter = new Converter({});

		request(url, function(error, response, data){
			assert.equal(error, null);

			console.log('historical prices loaded for ' + ticker);

			converter.fromString(data, function(err,result){
  			resolve(result);
			});

		})

	}); // promise function

}

exports.downloadKeyStats = function(ticker){

	var keyStatsUrl = 'https://sg.finance.yahoo.com/q/ks?s=';

	return new Promise(function(resolve,reject){
		var url = keyStatsUrl + ticker;

		request(url, function(error, response, html){

			if(error){
				console.log(error);
			} else {
				console.log('key stats html loaded for ' + ticker);
				var $ = cheerio.load(html);

				// intialize json doc
				var tempDoc = {};

				// set date of retrieval
				tempDoc.date = new Date();

				//collect period headings
				$('td.yfnc_tablehead1')
				.each(function(i, elm){


					tempDoc[$(this).text().replace(/\s/g, "_")]=$(this).siblings().first().text();

				});


				resolve(tempDoc);
			}			

		})

	})

}

exports.downloadCashFlow = function(ticker, annualBool){

var cashFlowUrl = 'https://sg.finance.yahoo.com/q/cf?s=';

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
				console.log('CF html loaded for ' + ticker);
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

				resolve(statArray);
			}			

		})

	})

}


exports.downloadBalSheet = function(ticker, annualBool){

	var balSheetUrl = 'https://sg.finance.yahoo.com/q/bs?s=';

	return new Promise(function(resolve,reject){
		var url = ''

		// concatenate url and ticker depending on annual parameter
		if(annualBool) {
			var url = balSheetUrl + ticker + '&annual';
		} else {
			var url = balSheetUrl + ticker;
		}

		request(url, function(error, response, html){

			if(error){
				console.log(error);
			} else {
				console.log('BS html loaded for ' + ticker);
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
				} // for

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

					});  //children.each

					// push line item onto each income statement document
					if (textArray.length != 0) {
						for (var i = 0; i< 4; i++) {
							statArray[i][textArray[0]]= textArray[i+1];
						}			
					}

				}); //siblings.each

				resolve(statArray);
			} // else			

		}) //request

	})

}


exports.downloadIncStatement = function(ticker, annualBool) {

	return new Promise(function(resolve,reject){
		var incStUrl = 'https://sg.finance.yahoo.com/q/is?s=';

		var url = '';
		
		// concatenate url and ticker depending on annual parameter
		if(annualBool) {
			var url = incStatUrl + ticker + '&annual';
		} else {
			var url = incStatUrl + ticker;
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
				
				//yfnc_modtitle is class of table header row
				$('tr.yfnc_modtitle1').children().each(function(i, elm){
					periodarray.push($(this).text().trim());
				});

				// push period ending headings as first item of each inc statement document
				for (var i = 1; i < 5; i++) {
					var docObj = {};
					docObj[periodarray[0]] = moment(periodarray[i], 'DD MMM, YYYY').toDate();
					statArray.push(docObj);
				}
				
				// siblings are the financial statement line items
				// in each line item row
				$('tr.yfnc_modtitle1').siblings()
				.each(function(i, elm){
					var textArray = [];
					// push table row data into a text array
					$(this).children().each(function(i, elm){
						var text = $(this).text().trim();
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

				resolve(statArray); 
			}

		});

	}); //promise function
};