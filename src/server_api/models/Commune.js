var mongoose = require('mongoose');

var CommuneSchema = new mongoose.Schema({
	nomC: String,
	idD: String,
	nomD: String,
	ins: Number,
	abs: Number,
	vot: Number,
	blc: Number,
	nul: Number,
	liste: [
		{
			nomP: String,
			nbrV: Number
		}
	]
});

module.exports = mongoose.model('commune', CommuneSchema);
