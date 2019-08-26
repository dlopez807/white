var trank = require('express').Router();
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');

var SmashCalTournament = require('../models/smash-cal-tournament');
var Tournament = require('../models/tournament');

// trank.use(function(req, res, next) {
// 	next();
// });

// trank.route('/')
// 	// create
// 	.post(function(req, res) {
// 		var app = new App();
// 		app.name = req.body.name;
// 		app.link = req.body.link;
// 		app.save(function(err, app) {
// 			if (err)
// 				res.send(err);
// 			res.json({
// 				message: 'app created',
// 				app: app
// 			})
// 		})
// 	})
// 	// get all
// 	.get(function (req, res) {
// 		App.find(function(err, apps) {
// 			if (err)
// 				res.send(err);
// 			res.json(apps);
// 		})
// 	});


// trank.route('/:appid')
// 	// get single
// 	.get(function(req, res) {
// 		App.findById(req.params.appid, function(err, app) {
// 			if (err)
// 				res.send(err);
// 			res.json(app);
// 		})
// 	})

// 	// update with new info
// 	.put(function(req, res) {
// 		App.findById(req.params.appid, function(err, app) {
// 			if (err)
// 				res.send(err);
			
// 			app.name = req.body.name;
// 			app.link = req.body.link;

// 			app.save(function(err) {
// 				if (err)
// 					res.send(err)

// 				res.json({
// 					message: 'app updated'
// 				});
// 			})
// 		})
// 	})

// 	// delete
// 	.delete(function(req, res) {
// 		App.remove({
// 			_id: req.params.appid
// 		}, function(err, bear) {
// 			if (err)
// 				res.send(err);

// 			res.json({
// 				message: 'successfully deleted'
// 			})
// 		})
// 	});
trank.route('/list')

	.get(function(req, res) {
		SmashCalTournament.find(function(err, tournaments) {
			if (err)
				res.send(err);
			res.json(tournaments.sort(function(a, b) {
				return a.startDate - b.startDate;
			}));
		})
	})

trank.route('/list/melee')

	.get(function(req, res) {
		SmashCalTournament.find(function(err, tournaments) {
			if (err)
				res.send(err);
			res.json(tournaments.filter(tournament => tournament.melee).sort(function(a, b) {
				return a.startDate - b.startDate;
			}));
		})
	})

trank.route('/list/update')

	.get(function(req, res) {
		var url = 'https://docs.google.com/spreadsheets/d/1WXWd5yTWVTKQ6S6OXrfYb1WL1DelFSPiiIS_6rWGlGI/htmlview?ts=5a9f221a&sle=true#gid=0';

		var options = {
			url: url,
			method: 'GET'
		};

		request(options, function(error, response, html) {

			if (!error) {
				var $ = cheerio.load(html);
				var selector = '#sheets-viewport > div:nth-child(1) table';
				var selection = $(selector);
				if (selection != '') {

					$('table tr', selection).each(function() {
						var name = $('td:nth-child(2)', this).text();
						var startDateFormatted = $('td:nth-child(3)', this).text();
						var endDateFormatted = $('td:nth-child(4)', this).text();
						var weekNumber = $('td:nth-child(5)', this).text();
						var region = $('td:nth-child(6)', this).text();
						var subregion = $('td:nth-child(7)', this).text();
						var city = $('td:nth-child(8)', this).text();
						var organizer = $('td:nth-child(9)', this).text();
						var slug = $('td:nth-child(10) a', this).text();
						var smashgg = slug;
						if (slug.includes('https://smash.gg/')) {
							slug = slug.replace('https://smash.gg/', '');
							if (slug.includes('tournament/'))
								slug = slug.replace('tournament/', '');
							if (slug.includes('/details'))
								slug = slug.replace('/details', '');
							if (slug.includes('/'))
								slug = slug.replace('/', '');
						}
						else
							slug = null;
						var meleeText = $('td:nth-child(11)', this).text();
						var melee = meleeText.includes('x');
						var wiiuText = $('td:nth-child(12)', this).text()
						var wiiu = wiiuText.includes('x');
						var query = {
							name
						};
						var update = {
							name,
							startDate: moment(startDateFormatted),
							startDateFormatted,
							endDate: moment(endDateFormatted),
							endDateFormatted,
							weekNumber,
							region,
							subregion,
							city,
							organizer,
							smashgg,
							slug,
							melee,
							meleeText,
							wiiu,
							wiiuText
						};
						var options = {
							new: true,
							upsert: true,
							setDefaultsOnInsert: true
						};
						SmashCalTournament.findOneAndUpdate(query, update, options, function(err, tournament) {
							
						});
							
					});

					SmashCalTournament.find(function(err, tournaments) {
						if (err)
							res.send(err);
						res.json(tournaments.sort(function(a, b) {
							return a.startDate - b.startDate;
						}));
					});
				}
				else {	
					res.contentType('json');
					res.send({
						success: false,
						html
					});
				}
			}
			else
				console.log('error');
		});
	});

trank.route('/tournaments')
	.get(function(req, res) {
		Tournament.find(function(err, tournaments) {
			if (err)
				res.send(err);
			res.json(tournaments.sort(function(a, b) {
				return a.date - b.date;
			}));
		})
	});

trank.route('/tournaments/slug/:slug')
	.get(function(req, res) {
		Tournament.findOne({slug: req.params.slug}, function(err, tournament) {
			if (err)
				res.send(err);
			res.json(tournament);
		})
	});

trank.route('/tournaments/slug/:slug/score')
	.get(function(req, res) {
		Tournament.findOne({slug: req.params.slug}, function(err, tournament) {
			if (err)
				res.send(err);
			res.json({
				slug: tournament.slug,
				score: tournament.score
			});
		})
	});

trank.route('/tournaments/update')
	.get(function(req, res) {
		SmashCalTournament.find(function(err, slugs) {
			if (err)
				res.send(err);
			
			var tournamentSlugs = slugs.filter(slug => slug.melee && slug.slug).map(slug => slug.slug);

			tournamentSlugs.forEach(function(slug) {

				var tournament = slug;
				var url = `https://api.smash.gg/tournament/${tournament}?expand[]=participants&mutations[]=playerData`;

				var options = {
					url: url,
					method: 'GET'
				};

				request(options, function(error, response, body) {
					var info = JSON.parse(body);
					var data = info.entities;
					
					var date = new Date(data.tournament.startAt * 1000);
					var participants = data.participants || [];
					var attendees = participants.length;

					var {
						rankedPlayers,
						score,
						topPlayers
					} = getRankedPlayers(participants);

					var query = {
						name: data.tournament.name,
					};
					var update = {
						slug: tournament,
						date,
						dateFormatted: moment(date).format('MMMM Do YYYY'),
						attendees,
						link: `https://smash.gg/tournament/${tournament}`,
						score,
						rankedPlayers,
						topPlayers
					};
					var options = {
						new: true,
						upsert: true,
						setDefaultsOnInsert: true
					};
					Tournament.findOneAndUpdate(query, update, options, function(err, tournament) {

					});
				});
			})
			Tournament.find(function(err, tournaments) {
				if (err)
					res.send(err);
				res.json(tournaments.sort(function(a, b) {
					return a.date - b.date;
				}));
			});
		});
	})

trank.route('/smashgg/:slug')
	.get(function(req, res) {
		var tournament = req.params.slug;
		var url = `https://api.smash.gg/tournament/${tournament}?expand[]=participants&mutations[]=playerData`;

		var options = {
			url: url,
			method: 'GET'
		};

		request(options, function(error, response, body) {
			var json = JSON.parse(body);			
			res.json({
				...json
			});
		})
	});

const CURRENT_SSBM_RANK_ID = 3454;
const RANK_LIMIT = 50;
const TOP_PLAYERS_LIMIT = 10;

function getRankedPlayers(players) {
	let rankedPlayers = [];
	let totalScore = 0;
	players.forEach(player => {
		const id = player.playerId;
		const rankings = player.mutations.players[id].rankings;
		const rankingSSBM = rankings.find(ranking => ranking.iterationId == CURRENT_SSBM_RANK_ID)
		if (rankingSSBM && rankingSSBM.rank <= RANK_LIMIT) {
			const score = (RANK_LIMIT + 1) - rankingSSBM.rank;
			rankedPlayers.push({
				gamerTag: player.gamerTag,
				prefix: player.prefix,
				rank: rankingSSBM.rank,
				score
			});
			totalScore += score;
		}
	});
	rankedPlayers.sort( (a, b) => a.rank - b.rank );
	return {
		rankedPlayers,
		score: totalScore,
		topPlayers: rankedPlayers.slice(0, TOP_PLAYERS_LIMIT)
	};
}

module.exports = trank;