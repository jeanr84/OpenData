var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Todo = require('../models/Region.js');

/* GET /region */
router.get('/', function(req, res, next) {
  Todo.find(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
});

/* GET /region/id */
router.get('/:id', function(req, res, next) {
  Todo.findOne({ '_id': req.params.id }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /region/parti/parti */
router.get('/parti/:parti', function(req, res, next) {
  Todo.aggregate([
	    {$project: {
		liste: {$filter: {
		    input: '$liste',
		    as: 'liste',
		    cond: {$eq: ['$$liste.nomP', req.params.parti]}
		}},
		'_id': 1,
		'nom' : 1,
		'nbrIm' : 1,
		'pourcentageIm' : 1,
		'nbrNais' : 1,
		'revenuMed' : 1,
		'tauxChom' : 1,
		'deps' : 1,
		'ins' : 1,
		'abs' : 1,
		'vot' : 1,
		'blc' : 1,
		'nul' : 1
	    }}
	], function (err, post) {
	    if (err) return next(err);
	    res.json(post);
  });
});

/* POST /region */
router.post('/', function(req, res, next) {
  Todo.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /region/:id */
router.delete('/:id', function(req, res, next) {
  Todo.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
