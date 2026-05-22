const mongoose = require('mongoose');

const PizzaSchema = new mongoose.Schema({
  id:          String,
  type:        String,
  price:       Number,
  name:        String,
  image:       String,
  description: String,
  ingredients: [String],
  topping:     [String]
});

module.exports = mongoose.model('Pizza', PizzaSchema);
