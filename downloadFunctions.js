var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var assert = require('assert');

exports.getSymbols = function(db, collectionName) {
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


exports.downloadBSorCF = function(ticker, sheetUrl, annualBool){

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

				resolve(statArray);
			}			

		})

	})

}


exports.downloadIncStatement = function(ticker, incStatUrl, annualBool) {

	return new Promise(function(resolve,reject){
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