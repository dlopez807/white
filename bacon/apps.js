var apps = require('express').Router();
// var mongoose = require('mongoose');
// var mongoDB = 'mongodb://admin:admin@ds019856.mlab.com:19856/niello';
// mongoose.connect(mongoDB, {
//   useMongoClient: true
// });

// mongoose.Promise = global.Promise;

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var bodyParser = require('body-parser');

var App = require('../models/app');

apps.use(function(req, res, next) {
	next();
});

apps.route('/')
	// create
	.post(function(req, res) {
		var app = new App();
		app.name = req.body.name;
		app.link = req.body.link;
		app.save(function(err, app) {
			if (err)
				res.send(err);
			res.json({
				message: 'app created',
				app: app
			})
		})
	})
	// get all
	.get(function (req, res) {
		App.find(function(err, apps) {
			if (err)
				res.send(err);
			res.json(apps);
		})
	});


apps.route('/:appid')
	// get single
	.get(function(req, res) {
		App.findById(req.params.appid, function(err, app) {
			if (err)
				res.send(err);
			res.json(app);
		})
	})

	// update with new info
	.put(function(req, res) {
		App.findById(req.params.appid, function(err, app) {
			if (err)
				res.send(err);
			
			app.name = req.body.name;
			app.link = req.body.link;

			app.save(function(err) {
				if (err)
					res.send(err)

				res.json({
					message: 'app updated'
				});
			})
		})
	})

	// delete
	.delete(function(req, res) {
		App.remove({
			_id: req.params.appid
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({
				message: 'successfully deleted'
			})
		})
	});;

module.exports = apps;