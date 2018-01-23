var codes = require('express').Router();
var mongoose = require('mongoose');
var mongoDB = 'mongodb://admin:admin@ds019856.mlab.com:19856/niello';
mongoose.connect(mongoDB, {
  useMongoClient: true,
  /* other options */
});

mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

var Code = require('../models/code');

codes.use(function(req, res, next) {
	console.log('codes: something is happening');
	next();
})

codes.route('/')
	// create code
	.post(function(req, res) {
		var code = new Code();
		code.name = req.body.name;

		const colors = getColors();
		let words = getWords(colors)
		words = assignColors(words, colors);
		code.words = words; // req.body.words;
		code.colors = req.body.colors;
		code.save(function(err, code) {
			if (err)
				res.send(err);
			res.json({
				success: true,
				message: 'code created',
				code: code
			})
		})
	})
	// get all notes
	.get(function (req, res) {
		Code.find(function(err, codes) {
			if (err)
				res.send(err);

			if (codes) {
				res.json({
					success: true,
					codes
				});
			}
			else {	
				res.json({
					success: false
				});
			}
		})
	});


codes.route('/:name')
	// get single note
	.get(function(req, res) {
		Code.findByName(req.params.name, function(err, code) {
			if (err)
				res.send(err);

			if (code)
				res.json({
					success: true,
					code
				});
			else
				res.json({success: false})
		})
	})

	// update note with new info
	.put(function(req, res) {
		Code.findByName(req.params.name, function(err, code) {
			if (err)
				res.send(err);
			
			code.name = req.body.name;
			code.words = req.body.words;
			code.colors = req.body.colors;

			code.save(function(err) {
				if (err)
					res.send(err)

				res.json({
					message: 'code updated'
				});
			})
		})
	})

	// delete note
	.delete(function(req, res) {
		Code.remove({
			name: req.params.name
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({
				message: 'successfully deleted'
			})
		})
	});

const getRandom = limit => {
	if (limit == undefined)
		limit = 10;
	return Math.floor(Math.random() * limit);
}

const getWords = () => {
	let words = [];
	for (let i = 0; i < WORD_COUNT; i++) {
		let word = '';
		while (word == '') {
			let random = getRandom(WORD_LIST.length)
			if (!words.includes(WORD_LIST[random]))
				word = WORD_LIST[random];
		}
		words.push({
			word
		});
	}	
	return words;
}

const getColors = () => {
	let colors = COLOR_LIST;
  getRandom() % 2 == 1 ? colors[0] = 'blue' : colors[0] = 'red';
  return colors;
};

const assignColors = (words, colors) => {
	colors.forEach(function(color) {
		
		let wordColor, random;
		do {
			random = getRandom(words.length);
			wordColor = words[random].color
		} while(wordColor != undefined);
		words[random].color = color;
	});
	return words;
}

const WORD_COUNT = 25;

const COLOR_LIST = [
	'blueOrRed',
	'blue',
	'blue',
	'blue',
	'blue',
	'blue',
	'blue',
	'blue',
	'red',
	'red',
	'red',
	'red',
	'red',
	'red',
	'red',
	'black'
];

const WORD_LIST =["AFRICA","AGENT","AIR","ALIEN","ALPS","AMAZON","AMBULANCE","AMERICA","ANGEL","ANTARCTICA","APPLE","ARM","ATLANTIS","AUSTRALIA","AZTEC","BACK","BALL","BAND","BANK","BAR","BARK","BAT","BATTERY","BEACH","BEAR","BEAT","BED","BEIJING","BELL","BELT","BERLIN","BERMUDA","BERRY","BILL","BLOCK","BOARD","BOLT","BOMB","BOND","BOOM","BOOT","BOTTLE","BOW","BOX","BRIDGE","BRUSH","BUCK","BUFFALO","BUG","BUGLE","BUTTON","CALF","CANADA","CAP","CAPITAL","CAR","CARD","CARROT","CASINO","CAST","CAT","CELL","CENTAUR","CENTER","CHAIR","CHANGE","CHARGE","CHECK","CHEST","CHICK","CHINA","CHOCOLATE","CHURCH","CIRCLE","CLIFF","CLOAK","CLUB","CODE","COLD","COMIC","COMPOUND","CONCERT","CONDUCTOR","CONTRACT","COOK","COPPER","COTTON","COURT","COVER","CRANE","CRASH","CRICKET","CROSS","CROWN","CYCLE","CZECH","DANCE","DATE","DAY","DEATH","DECK","DEGREE","DIAMOND","DICE","DINOSAUR","DISEASE","DOCTOR","DOG","DRAFT","DRAGON","DRESS","DRILL","DROP","DUCK","DWARF","EAGLE","EGYPT","EMBASSY","ENGINE","ENGLAND","EUROPE","EYE","FACE","FAIR","FALL","FAN","FENCE","FIELD","FIGHTER","FIGURE","FILE","FILM","FIRE","FISH","FLUTE","FLY","FOOT","FORCE","FOREST","FORK","FRANCE","GAME","GAS","GENIUS","GERMANY","GHOST","GIANT","GLASS","GLOVE","GOLD","GRACE","GRASS","GREECE","GREEN","GROUND","HAM","HAND","HAWK","HEAD","HEART","HELICOPTER","HIMALAYAS","HOLE","HOLLYWOOD","HONEY","HOOD","HOOK","HORN","HORSE","HORSESHOE","HOSPITAL","HOTEL","ICE","ICE CREAM","INDIA","IRON","IVORY","JACK","JAM","JET","JUPITER","KANGAROO","KETCHUP","KEY","KID","KING","KIWI","KNIFE","KNIGHT","LAB","LAP","LASER","LAWYER","LEAD","LEMON","LEPRECHAUN","LIFE","LIGHT","LIMOUSINE","LINE","LINK","LION","LITTER","LOCH NESS","LOCK","LOG","LONDON","LUCK","MAIL","MAMMOTH","MAPLE","MARBLE","MARCH","MASS","MATCH","MERCURY","MEXICO","MICROSCOPE","MILLIONAIRE","MINE","MINT","MISSILE","MODEL","MOLE","MOON","MOSCOW","MOUNT","MOUSE","MOUTH","MUG","NAIL","NEEDLE","NET","NEW YORK","NIGHT","NINJA","NOTE","NOVEL","NURSE","NUT","OCTOPUS","OIL","OLIVE","OLYMPUS","OPERA","ORANGE","ORGAN","PALM","PAN","PANTS","PAPER","PARACHUTE","PARK","PART","PASS","PASTE","PENGUIN","PHOENIX","PIANO","PIE","PILOT","PIN","PIPE","PIRATE","PISTOL","PIT","PITCH","PLANE","PLASTIC","PLATE","PLATYPUS","PLAY","PLOT","POINT","POISON","POLE","POLICE","POOL","PORT","POST","POUND","PRESS","PRINCESS","PUMPKIN","PUPIL","PYRAMID","QUEEN","RABBIT","RACKET","RAY","REVOLUTION","RING","ROBIN","ROBOT","ROCK","ROME","ROOT","ROSE","ROULETTE","ROUND","ROW","RULER","SATELLITE","SATURN","SCALE","SCHOOL","SCIENTIST","SCORPION","SCREEN","SCUBA DIVER","SEAL","SERVER","SHADOW","SHAKESPEARE","SHARK","SHIP","SHOE","SHOP","SHOT","SINK","SKYSCRAPER","SLIP","SLUG","SMUGGLER","SNOW","SNOWMAN","SOCK","SOLDIER","SOUL","SOUND","SPACE","SPELL","SPIDER","SPIKE","SPINE","SPOT","SPRING","SPY","SQUARE","STADIUM","STAFF","STAR","STATE","STICK","STOCK","STRAW","STREAM","STRIKE","STRING","SUB","SUIT","SUPERHERO","SWING","SWITCH","TABLE","TABLET","TAG","TAIL","TAP","TEACHER","TELESCOPE","TEMPLE","THEATER","THIEF","THUMB","TICK","TIE","TIME","TOKYO","TOOTH","TORCH","TOWER","TRACK","TRAIN","TRIANGLE","TRIP","TRUNK","TUBE","TURKEY","UNDERTAKER","UNICORN","VACUUM","VAN","VET","WAKE","WALL","WAR","WASHER","WASHINGTON","WATCH","WATER","WAVE","WEB","WELL","WHALE","WHIP","WIND","WITCH","WORM","YARD"];

module.exports = codes;