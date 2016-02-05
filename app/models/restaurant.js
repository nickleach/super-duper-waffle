var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RestaurantSchema  = new Schema({
	name: String,
  description: String,
  type: String,
  location: String
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
