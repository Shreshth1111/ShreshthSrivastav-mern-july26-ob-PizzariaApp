const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

/*
 * GET /api/ingredients
 * Fetches all ingredient documents from the ingredients collection.
 * Used by the Build Ur Pizza page to display the ingredient checklist.
 */
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
