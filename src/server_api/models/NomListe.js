var mongoose = require('mongoose');

var NomListeSchema = new mongoose.Schema({
	_id: String,
	nomL: String
});

module.exports = mongoose.model('nomliste', NomListeSchema);

