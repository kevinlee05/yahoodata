var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tickerDataSchema = new Schema({
	symbol: String,
	yahoohref: String,
	name: String
});

var tickerData = mongoose.model('tickerData', tickerDataSchema);

module.exports = tickerData;

