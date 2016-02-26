'use strict';

var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var tickerData = require('./models/tickerData');

mongoose.connect('mongodb://localhost/yahoodata');

var url = 'https://sg.finance.yahoo.com/q/cp?s=%5ESTI';

request(url, function(error, response, html){
	if(error){
		console.log(error);
	} else {
		console.log('html loaded');
		var $ = cheerio.load(html);

		$('.yfnc_tabledata1').each(function(i, elem){

			if( i % 5 == 0) {

				var ticker = new tickerData({
					symbol: $(elem).text(),
					yahoohref: $(elem).find('a').attr('href'),
					name: $(elem).next().text()
				});

				ticker.save(function(err){
					if(err) throw err;

					console.log(ticker.symbol + ' saved successfully');
				})

			} 

		});

	}
})

mongoose.disconnect();




