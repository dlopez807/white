var notes = require('express').Router();

var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

var Note = require('../models/note');

notes.use(function(req, res, next) {
	console.log('notes: something is happening');
	next();
})

// notes.param('noteid', function(req, res, next, id) {
// 	next();
// });
// sword.param('verse', function(req, res, next, id) {
// 	next();
// });

notes.route('/')
	// create note
	.post(function(req, res) {
		var note = new Note();
		note.title = req.body.title;
		note.body = req.body.body;
		note.user = req.body.user;
		note.save(function(err, note) {
			if (err)
				res.send(err);
			res.json({
				message: 'note created',
				note: note
			})
		})
	})
	// get all notes
	.get(function (req, res) {
		Note.find(function(err, notes) {
			if (err)
				res.send(err);
			res.json(notes);
		})
	});


notes.route('/:noteid')
	// get single note
	.get(function(req, res) {
		Note.findById(req.params.noteid, function(err, note) {
			if (err)
				res.send(err);
			res.json(note);
		})
	})

	// update note with new info
	.put(function(req, res) {
		Note.findById(req.params.noteid, function(err, note) {
			if (err)
				res.send(err);
			
			note.title = req.body.title;
			note.body = req.body.body;
			note.user = req.body.user;

			note.save(function(err) {
				if (err)
					res.send(err)

				res.json({
					message: 'note updated'
				});
			})
		})
	})

	// delete note
	.delete(function(req, res) {
		Note.remove({
			_id: req.params.noteid
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({
				message: 'successfully deleted'
			})
		})
	});

// notes.get('/:bookch/:verse', function(req, res) {
	
	
// });

// notes.get('/dailytext', function(req, res) {

	
// });

module.exports = notes;