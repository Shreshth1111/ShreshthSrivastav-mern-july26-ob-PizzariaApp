const express = require('express');
const router = express.Router();
const ShoppingCart = require('../models/ShoppingCart');

/*
 * GET /api/cart
 * Returns all items currently in the shopping cart.
 */
router.get('/', async (req, res) => {
  try {
    const items = await ShoppingCart.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
 * POST /api/cart
 * Adds an item to the cart.
 * If the item already exists (same itemId), increments its quantity.
 * If new, creates a fresh cart document.
 *
 * Request body: { itemId, name, price, image, type }
 */
router.post('/', async (req, res) => {
  const { itemId, name, price, image, type } = req.body;
  try {
    const existing = await ShoppingCart.findOne({ itemId });
    if (existing) {
      existing.quantity += 1;
      await existing.save();
      return res.json(existing);
    }
    const item = new ShoppingCart({ itemId, name, price, image, type });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*
 * PUT /api/cart/:id
 * Updates the quantity of a cart item by its MongoDB _id.
 * Called when user clicks + or - on the cart page.
 *
 * Request body: { quantity }
 */
router.put('/:id', async (req, res) => {
  try {
    const item = await ShoppingCart.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*
 * DELETE /api/cart/:id
 * Removes a specific item from the cart by its MongoDB _id.
 * Called when user clicks the remove button on the cart page.
 */
router.delete('/:id', async (req, res) => {
  try {
    await ShoppingCart.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
