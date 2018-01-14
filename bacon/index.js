var bacon = require('express').Router();
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

module.exports = bacon;