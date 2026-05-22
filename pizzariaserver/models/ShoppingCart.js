const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  itemId:   String,
  name:     String,
  price:    Number,
  image:    String,
  type:     String,
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('ShoppingCart', CartSchema);
