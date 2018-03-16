var bacon = require('express').Router();

var mongoose = require('mongoose');
var mongoDB = 'mongodb://admin:admin@ds019856.mlab.com:19856/niello';
// var mongoDB = 'mongodb://admin:admin@ds213199.mlab.com:13199/dev';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var bodyParser = require('body-parser');

bacon.use(bodyParser.urlencoded({ extended: true }));

bacon.get('/', function(req, res) {
	var message = 'bacon backend :B';
	console.log(message);
	res.contentType('json');
	res.send({
		success: true,
		message: message
	});
});

bacon.post('/', function(req, res) {
	console.log('bacon');
	res.contentType('json');
	res.send( {bacon: JSON.stringify({response:'juice'}) });
});

var sword = require('./sword');
bacon.use('/sword', sword);
var notes = require('./notes');
bacon.use('/notes', notes)
var espn = require('./espn');
bacon.use('/espn', espn);
var codes = require('./codes');
bacon.use('/codes', codes);
var trank = require('./trank');
bacon.use('/trank', trank);
// var apps = require('./apps');
// bacon.use('/apps', apps);

module.exports = bacon;