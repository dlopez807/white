var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
app.set('port', (process.env.PORT || 8791));

app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.text({
	limit: '50mb'
}));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/sample', function(req, res) {
	res.sendFile(path.join(__dirname + '/whitepages.html'));
});

app.post('/survey', function(req, res) {

	var html = req.body.white;
	var separator = req.body.separator;
	console.log(req.body.limit);
	var filipinoLimit = parseInt(req.body.limit) || 15;
	if (html == '') {
		html = fs.readFileSync('whitepages.html', 'utf-8', function() {
			console.log('success');
		});
	}

	var $ = cheerio.load(html);

	var file = fs.readFileSync('lastnames.json');
	var lastnames = JSON.parse(file);

	// selectors for item, address, and name
	var itemSelector = '.associated-people.card-list-wrapper ul .card-btn';//'.unstyled.grid-list-2.no-overflow > li';
	var addressSelector = 'p.assoicated-link-title';
	var nameSelector = 'p.grey-subtitle';

	var streets = {};
	$(itemSelector).each(function() {

		// get the address
		var address = $(addressSelector, this).text();
		var addressArray = address.split(' ');
		var apt = '';
		if (addressArray[addressArray.length - 2] != 'Apt') {
			var street = addressArray[addressArray.length - 2] + ' ' + addressArray[addressArray.length - 1];
		}
		else {
			var street = addressArray[addressArray.length - 4] + ' ' + addressArray[addressArray.length - 3];
			apt = addressArray[addressArray.length - 2] + ' ' + addressArray[addressArray.length - 1];
		}
		
		var streetNumber = addressArray[0];
		if (addressArray[1].indexOf('/') > -1)
			streetNumber += ' ' + addressArray[1];
		if (apt)
			streetNumber += ' ' + apt;

		// get the last name
		var text = $(nameSelector, this).text().trim();
		if (text.indexOf('No current residents listed for this location') < 0) {
			name = text.split(' res')[0].split(' and')[0];
			var names = name.split(' ');
			var first = names[0];
			var last = names[names.length - 1];
			if (last == 'Sr.' || last == 'Jr.')
				last = names[names.length - 2];

			if (lastnames[last] || lastnames[last] == 0) {
				var number = lastnames[last];
				if (number != 'NF' && parseInt(number) >= filipinoLimit) {

					//console.log(last + ' ' + number + '\n' + address + '\n');
					if (streets[street]) {
						streets[street].push(streetNumber + separator + street + separator + first + ' ' + last + separator + number);
					}
					else {
						streets[street] = [streetNumber + separator + street + separator + first + ' ' + last + separator + number];
					}


				}
			}
			else {
				//console.log('last name doesn\'t exist!')
				var options = {
					url: 'https://lastnames.myheritage.com/last-name/' + last,
					method: 'GET'
				};

				request(options, function(error, response, html) {

					if (!error) {

						var $ = cheerio.load(html);

						var noFilipinos = true;
						var number = '';
						
						$('table.legend tr').each(function() {
							var text = $('.FL_LabelxSmall', this).text();
							if (text == 'Philippines') {
								noFilipinos = false;
								number = $('.FL_LabelDimmedxSmall', $(this).next()).text();
								number = number.trim().replace('(', '').replace('%', '').replace(')', '');
								lastnames[last] = parseInt(number);
							}
						})
						if (noFilipinos) {							number = 'NF';
							lastnames[last] = 0;
						}
						if (number != 'NF' && parseInt(number) >= filipinoLimit)
							//console.log(last + ' ' + number + '\n' + address + '\n');

						fs.writeFile('lastnames.json', JSON.stringify(lastnames, null, 4), function(err) {

						 	//console.log('file successfully written')
						 });
					}
					else
						console.log('error');
				});
			}
			
		}
	});
	var out = '<a href=\'/\'>Go back</a><br><br>';
	out += 'Reload a couple times just to make sure<br><br>';
	out += 'Copy below and paste into Google Sheets<br><br>';
	out += '(might need to paste in notepad first to fix formatting)';
	out += '<pre>';
	for (var street in streets ) {
	    if (streets.hasOwnProperty(street)) {
	        //out += street + '<br>';
	        streets[street].forEach(function(number) {
	        	out += number + '<br>';
	        });
	    }
	}
	out += '</pre>';
	res.send(out);
});

app.get('/lastnames', function(req, res) {
	res.sendFile(path.join(__dirname + '/lastnames.json'));
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

app.listen(app.get('port'));
console.log('magic happens on port ' + app.get('port'));
exports = module.exports = app;