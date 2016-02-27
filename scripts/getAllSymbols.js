var request = require('request');
var cheerio = require('cheerio');
var assert = require('assert');
var Q = require('q')

module.exports = function(){
	return new Promise(function(resolve,reject){
		getDownloadSymbolsFuncsArray().then(function(results){
			var allSymbols = [];

			for(var i = 0; i < results.length; i++){

				allSymbols.push.apply(allSymbols, results[i]);

			}

			resolve(allSymbols);
		})		
	})
}

function getDownloadSymbolsFuncsArray(){
	var initials = "34567ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

	var downloadFuncsArray = [];

	for (i = 0; i < initials.length; i++){
		downloadFuncsArray.push(downloadSymbolsOnePage(initials[i]));
	}
	
	return Q.all(downloadFuncsArray);

}

function downloadSymbolsOnePage(initial){
	return new Promise(function(resolve, reject){
		var urlFront = "http://eoddata.com/stocklist/SGX/"
		var url = urlFront + initial +  '.htm';
		var data = [];

		request(url, function(error, response, html){

			if(error){
				console.log(error);
			} 

			else {
				console.log('html loaded from ' + url);

				var $ = cheerio.load(html);
				
				$('tr.ro').each(function(i,elm){
					var tempDoc = {};

					tempDoc.symbol = $(this).children().eq(0).text();
					tempDoc.name = $(this).children().eq(1).text();

					data.push(tempDoc);
					
				})

				$('tr.re').each(function(i,elm){
					var tempDoc = {};

					tempDoc.symbol = $(this).children().eq(0).text();
					tempDoc.name = $(this).children().eq(1).text();

					data.push(tempDoc);
					
				})

				resolve(data);

			}	// else

		});//request


	})
}