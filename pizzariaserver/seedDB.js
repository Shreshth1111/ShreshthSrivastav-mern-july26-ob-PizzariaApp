const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Pizza       = require('./models/Pizza');
const Ingredient  = require('./models/Ingredient');
const ShoppingCart = require('./models/ShoppingCart');

const pizzas      = require('./seed/pizzas.json');
const ingredients = require('./seed/ingredients.json');

/*
 * seedDB connects to MongoDB, clears all existing data,
 * then inserts the fresh seed data from the JSON files.
 * Run this script ONCE before starting the server:
 *   node seedDB.js
 */
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    /* Clear existing documents to avoid duplicates on re-seed */
    await Pizza.deleteMany({});
    await Ingredient.deleteMany({});
    await ShoppingCart.deleteMany({});
    console.log('Cleared existing data');

    /* Insert fresh data */
    await Pizza.insertMany(pizzas);
    await Ingredient.insertMany(ingredients);
    console.log('Database seeded successfully');

    mongoose.connection.close();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
