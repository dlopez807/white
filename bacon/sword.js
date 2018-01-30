var sword = require('express').Router();
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');

sword.param('bookch', function(req, res, next, id) {
	next();
});
sword.param('verse', function(req, res, next, id) {
	next();
});

sword.get('/', function (req, res) {
	var out = 'bacon/sword/bookchapter/verse ex: bacon/sword/gen1/1';
	res.send(out);
});

sword.get('/:bookch/:verse', function(req, res) {
	
	var bookch = req.params.bookch;
	var verse = req.params.verse;
	var search = bookch + ':' + verse;

	var url = 'http://wol.jw.org/en/wol/l/r1/lp-e?q=' + search;

	// tagalog url
	//var url = 'https://wol.jw.org/tl/wol/l/r27/lp-tg?q=' + search;
	var options = {
		url: url,
		method: 'GET'
	};

	request(options, function(error, response, html) {

		if (!error) {
			console.log('search', search);
			var $ = cheerio.load(html);
			//var out = '';
			var reference = $('.results .caption').text();
			if (reference != '') {
				var text = '';
				 $('.bibleCitation article p span').each(function() {
				 	text += $(this).clone()    //clone the element
				    .children() //select all the children
				    .remove()   //remove all the children
				    .end()	 //again go back to selected element
					.text();
				 });
				//out = text + '(' + reference + ')';
				//res.send(out);
				res.contentType('json');
				//res.send( {bacon: JSON.stringify({response:'juice'}) });
				res.send({
					success: true,
					text: text.trim(),
					reference: reference
				});
			}
			else {	
				res.contentType('json');
				res.send({
					success: false
				});
			}
		}
		else
			console.log('error');
	});
});

sword.get('/dailytext', function(req, res) {

	var year = moment().format('YYYY');
	var month = moment().format('M');
	var day = moment().format('D');
	var url = 'https://wol.jw.org/en/wol/dt/r1/lp-e/' + year + '/' + month + '/' + day;
	//var url = 'https://wol.jw.org/en/wol/h/r1/lp-e';
	var options = {
		url: url,
		method: 'GET'
	};

	request(options, function(error, response, html) {

		if (!error) {
			console.log('daily text');
			var $ = cheerio.load(html);
			var dailyTextSelector = '.todayItems .todayItem.pub-es' + moment().format('YY');
			var dailyTextElement = $(dailyTextSelector).text();
			if (dailyTextElement != '') {
				var date, text, reference, comment;
				date = $(dailyTextSelector + ' header h2').text();
				text = $(dailyTextSelector + ' p.themeScrp').text();
				comment = $(dailyTextSelector + ' .sb').text();
				dailyText = date + '\n' + text + '\n' + comment;
				res.contentType('json');
				res.send({
					success: true,
					date: date,
					text: text,
					comment: comment,
					dailyText: dailyText
				});
			}
			else {	
				res.contentType('json');
				res.send({
					success: false
				});
			}
		}
		else
			console.log('error');
	});
});

module.exports = sword;