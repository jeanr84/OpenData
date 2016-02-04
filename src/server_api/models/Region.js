var mongoose = require('mongoose');

var RegionSchema = new mongoose.Schema({
	_id: String,	
	nom: String,
	nbrIm: Number,
	pourventageIm: Number,
	revenuMed: Number,
	nbrNais: Number,
	ins: Number,
	abs: Number,
	vot: Number,
	blc: Number,
	nul: Number,
	deps: [
		{
			dep: String
		}
	],
	liste: [
		{
			nomP: String,
			nbrV: Number,
			pourcentage: Number
		}
	]
});

module.exports = mongoose.model('region', RegionSchema);
