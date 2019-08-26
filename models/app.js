var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AppSchema = new Schema({
	name: String,
	link: String
});

module.exports = mongoose.model('App', AppSchema);