var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CodeGameSchema = new Schema({
	name: String,
	words: Array,
	color: Array
});

CodeGameSchema.static('findByName', function (name, callback) {
  return this.findOne({ name: name }, callback);
});

module.exports = mongoose.model('Code', CodeGameSchema);