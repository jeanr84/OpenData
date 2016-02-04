var mongoose = require('mongoose');

var DepartementSchema = new mongoose.Schema({
	_id: String,	
	nom: String,
	idR: String,
	nbrIm: Number,
	pourcentageIm: Number,
	nbrNais: Number,
	revenuMed: Number,
	tauxChom: Number,
	ins: Number,
	abs: Number,
	vot: Number,
	blc: Number,
	nul: Number,
	liste: [
		{
			nomP: String,
			nbrV: Number,
			pourcentage: Number
		}
	]
});

module.exports = mongoose.model('departement', DepartementSchema);
