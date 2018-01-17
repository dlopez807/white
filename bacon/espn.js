var espn = require('express').Router();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');

espn.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

espn.route('/')
	.get(function(req, res) {
		//var html = fs.readFileSync('./bacon/ssc.html', 'utf-8', function() {
		var html = fs.readFileSync('./bacon/opp.html', 'utf-8', function() {
			console.log('success');
		});

		let team = getTeam(html);

		team.totalcats = getTotalCats(team.players);
		
		res.contentType('json');
		res.send(team);
	})
	.post(function(req, res) {
		console.log('post');
		var team1 = req.body.team1;
		var team2 = req.body.team2;

		if (team1 == '') {
			team1 = fs.readFileSync('./bacon/ssc.html', 'utf-8', function() {
				console.log('success');
			});
		}
		if (team2 == '') {
			team2 = fs.readFileSync('./bacon/opp.html', 'utf-8', function() {
				console.log('success');
			});
		}
		
		var matchup = {
			team1: getTeam(team1),
			team2: getTeam(team2)
		}
		res.contentType('json');
		res.send(matchup);
	});

const getTeam = (html) => {
	var gamesPerPlayer = {
		GS: 3,//gs
		Mia: 4,//mia
		Utah: 4,//uta
		Det: 4,//det
		Ind: 4,//ind
		Bkn: 4,//brk
		Sac: 3,//sac
		Nor: 3,//nor
		LAC: 3,//lac
		Phi: 3,
		Cle: 3,
		LAL: 4,
		Chi: 3,
		Por: 3,
		Den: 3,
		Bos: 3,
		Pho: 2,
		Min: 3
	};
	var $ = cheerio.load(html);

	var teamname = $('.team-name').text();
	var players = [];
	$('.playerTableTable tbody tr').each(function() {
		$('.playerEditSlot', this).remove();
		var playerName = $('.playertablePlayerName', this).text();
		if (playerName != '')
			if (!playerName.includes('*')) {
				//var name = nameText.split(/,(.+)/)[0];
				//var teamPosition = nameText.split(/,(.+)/)[1];
				//var team = teamPosition.split(/ (.+)/)[0];
				let [name, ...teamPosition] = playerName.split(', ')
				teamPosition = teamPosition.join(', ');
				let [team, ...position] = teamPosition.split(/\s/);
				position = position.join(' ');
				games = gamesPerPlayer[team];
				var fgmfga = $('td:nth-child(8)', this).text();
				var fgmfgaSplit = fgmfga.split('/');
				var fgm = fgmfgaSplit[0];
				var fga = fgmfgaSplit[1];
				var fgp = $('td:nth-child(9)', this).text();
				var ftmfta = $('td:nth-child(10)', this).text();
				var ftmftaSplit = ftmfta.split('/');
				var ftm = ftmftaSplit[0];
				var fta = ftmftaSplit[1];
				var ftp = $('td:nth-child(11)', this).text();
				var tpm = $('td:nth-child(12)', this).text();
				var reb = $('td:nth-child(13)', this).text();
				var ast = $('td:nth-child(14)', this).text();
				var stl = $('td:nth-child(15)', this).text();
				var blk = $('td:nth-child(16)', this).text();
				var to = $('td:nth-child(17)', this).text();
				var pts = $('td:nth-child(18)', this).text();

				players.push({
					name,
					team,
					position,
					games,
					fgm,
					fga,
					fgp,
					ftm,
					fta,
					ftp,
					tpm,
					reb,
					ast,
					stl,
					blk,
					to,
					pts
				});
		}
	});

	return {
		teamname: teamname,
		players: players,
		totalcats: getTotalCats(players)
	};
}

const getTotalCats = (players) => {
	var totalcats = {
		fgm: 0,
		fga: 0,
		fgp: 0,
		ftm: 0,
		fta: 0,
		ftp: 0,
		tpm: 0,
		reb: 0,
		ast: 0,
		stl: 0,
		blk: 0,
		to: 0,
		pts: 0
	};
	players.forEach(function(player, index) {
		totalcats.fgm += parseInt(player.fgm) * player.games;
		totalcats.fga += parseInt(player.fga) * player.games;
		totalcats.ftm += parseInt(player.ftm) * player.games;
		totalcats.fta += parseInt(player.fta) * player.games;
		totalcats.tpm += parseInt(player.tpm) * player.games;
		totalcats.reb += parseInt(player.reb) * player.games;
		totalcats.ast += parseInt(player.ast) * player.games;
		totalcats.stl += parseInt(player.stl) * player.games;
		totalcats.blk += parseInt(player.blk) * player.games;
		totalcats.to += parseInt(player.to) * player.games;
		totalcats.pts += parseInt(player.pts) * player.games;
	});
	totalcats.fgp = totalcats.fgm / totalcats.fga;
	totalcats.ftp = totalcats.ftm / totalcats.fta;

	return totalcats;
}

module.exports = espn;