var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
	title: String,
	body: String,
	author: String
});

module.exports = mongoose.model('Note', NoteSchema);