const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');

/*
 * GET /api/pizzas
 * Fetches all pizza documents from the pizzas collection.
 * Used by the Order Pizza page to display the full menu.
 */
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
