var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/', function(req, res) {

	var html = fs.readFileSync('whitepages.html', 'utf-8', function() {
		console.log('success');
	});

	var $ = cheerio.load(html);

	var file = fs.readFileSync('lastnames.json');
	var lastnames = JSON.parse(file);

	var out = '';
	$('.unstyled.grid-list-2.no-overflow > li').each(function() {
		var address = $('.title', this).text();
		var text = $('.subtitle', this).text().trim();
		if (text.indexOf('No current residents listed for this location') < 0) {
			name = text.split(' res')[0].split(' and')[0];
			var names = name.split(' ');
			var last = names[names.length - 1];
			if (last == 'Sr.' || last == 'Jr.')
				last = names[names.length - 2];

			if (lastnames[last] || lastnames[last] == 0) {
				var number = lastnames[last];
				if (number != 'NF' && parseInt(number) > 3)
					console.log(last + ' ' + number + '\n' + address + '\n');
			}
			else {
				console.log('last name doesn\'t exist!')
				var options = {
					url: 'https://lastnames.myheritage.com/last-name/' + last,
					method: 'GET'
				};

				request(options, function(error, response, html) {

					// make sure no errors when making request
					if (!error) {

						var $ = cheerio.load(html);

						var noFilipinos = true;
						var number = '';
						
						$('table.legend tr').each(function() {
							var text = $('.FL_LabelxSmall', this).text();
							if (text == 'Philippines') {
								noFilipinos = false;
								//console.log('we found one');
								number = $('.FL_LabelDimmedxSmall', $(this).next()).text();
								number = number.trim().replace('(', '').replace('%', '').replace(')', '');
								lastnames[last] = parseInt(number);
							}
						})
						if (noFilipinos) {
							//console.log(name + ' has no Filipinos');
							number = 'NF';
							lastnames[last] = 0;
						}
						if (number != 'NF' && parseInt(number) > 3)
							console.log(last + ' ' + number + '\n' + address + '\n');
						out += last + ' ' + number +  '<br>' + address + '<br>';

						fs.writeFile('lastnames.json', JSON.stringify(lastnames, null, 4), function(err) {

						 	console.log('file successfully written')
						 });
					}
					else
						console.log('error');
				});
			}
			
		}
	});
	res.send('check console');
	//res.send(html);
});

app.param('name', function(req, res, next, id) {
	next();
});

app.get('/lastname/:name', function(req, res) {

	name = req.params.name;

	var options = {
		url: 'https://lastnames.myheritage.com/last-name/' + name,
		method: 'GET'
	};

	request(options, function(error, response, html) {

		// make sure no errors when making request
		if (!error) {

			var $ = cheerio.load(html);

			var noFilipinos = true;
			var out = ''
			$('table.legend tr').each(function() {
				var text = $('.FL_LabelxSmall', this).text();
				if (text == 'Philippines') {
					noFilipinos = false;
					//console.log('we found one');
					var number = $('.FL_LabelDimmedxSmall', $(this).next()).text();
					number = number.trim().replace('(', '').replace('%', '').replace(')', '');
					console.log(name, number);
					out = name + ': ' + number;
				}
			})
			if (noFilipinos) {
				console.log(name + ' has no Filipinos');
				out = name + ' has no Filipinos';
			}
			res.send(out);
		}
		else
			console.log('error');

		// fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {

		//  	console.log('file successfully written')
		//  });
	});	
});

app.get('/address', function(req, res) {

	var options = {
		url: 'http://www.whitepages.com/neighbors/d68e2955-d4e6-4510-a15b-686aadd4c3c7',
		method: 'GET',
		headers: {
			'User-Agent': 'request'
		}	
	};

	request(options, function(error, response, html) {

		// make sure no errors when making request
		if (!error) {

			// utilize cheerio library on returned html,
			// which essentially give us jquery functionality
			var $ = cheerio.load(html);

			// define variables we're going to capture
			//var title, release, rating;
			//var brand, title, price;

			
			//console.log($('body > form').attr('name'));
			//console.log(response);
			console.log(html);
			
			$('.FL_LabelxSmall').each(function() {
				var text = $(this).text();
				console.log(text);
			})

			// $('.unstyled.grid-list-2.no-overflow > li').each(function() {
			// 	var address = $('.title', this).text();
			// 	var text = $('.subtitle', this).text().trim();
			// 	if (text.indexOf('No current residents listed for this location') < 0) {
			// 		name = text.split(' res')[0].split(' and')[0];

			// 		console.log(name);
			// 		console.log(address);
			// 		console.log('');
			// 	}
			// });
			//res.send('check console');
			res.send(html);
		}
		else
			console.log('error');

		// fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {

		//  	console.log('file successfully written')
		//  });
	});

	 

	
});

app.get('/test', function(req, res) {
	// request('/lastnames/lopez', function(error, response, body) {
	// 	if (!error) {
	// 		console.log(response);
	// 		console.log(body);
	// 	}
	// })
	console.log('test');
	res.send('test');
})

app.get('/foo', function(req, res) {
	console.log('foo');
	var options = {
		url: '/test',
		method: 'GET'
	};
	request(options, function(error, response, body) {
		if (!error) {
			console.log(response);
			console.log(body);
		}
		else
			console.log('error');
	})
	res.send('foo');
})
var port = 
app.listen(port);
console.log('magic happens on port ' + port);
exports = module.exports = app;

/*
$('.unstyled.grid-list-2.no-overflow > li .subtitle').each(function() {
 lastnames.push($(this).text()); 
})

$('.unstyled.grid-list-2.no-overflow > li').each(function() {
	var address = $('.title', this).text();
	var text = $('.subtitle', this).text().trim();
	if (text.indexOf('No current residents listed for this location') < 0) {
		name = text.split(' res')[0].split(' and')[0];

		console.log(name);
		console.log(address);
		console.log('');
	}
});
*/
