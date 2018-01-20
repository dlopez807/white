var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CodeSchema = new Schema({
	name: String,
	words: Array,
	color: Array
});

CodeSchema.static('findByName', function (name, callback) {
  return this.findOne({ name: name }, callback);
});

module.exports = mongoose.model('Code', CodeSchema);