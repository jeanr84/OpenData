var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Todo = require('../models/Departement.js');

/* GET /departement */
router.get('/', function(req, res, next) {
  Todo.find(function (err, todos) {
    if (err) return next(err);
    res.json(todos);
  });
});

/* GET /departement/id */
router.get('/:id', function(req, res, next) {
  Todo.findOne({ '_id': req.params.id }, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /departement/idR/parti */
router.get('/:idR/:parti', function(req, res, next) {
  Todo.aggregate([
	    {$match: {'_id': req.params.idR}},
	    {$project: {
		liste: {$filter: {
		    input: '$liste',
		    as: 'liste',
		    cond: {$eq: ['$$liste.nomP', req.params.parti]}
		}},
		'_id': 1,
		'nomD' : 1,
		'idR' : 1,
		'nbrIm' : 1,
		'pourcentageIm' : 1,
		'nbrNais' : 1,
		'revenuMed' : 1,
		'tauxChom' : 1,
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

/* POST /departement */
router.post('/', function(req, res, next) {
  Todo.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* DELETE /departement/:id */
router.delete('/:id', function(req, res, next) {
  Todo.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
