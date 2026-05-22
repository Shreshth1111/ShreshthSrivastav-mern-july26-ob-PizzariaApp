const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/*
 * Helper: generates a JWT token containing the user's id and email.
 * Token expires in 7 days. Frontend stores this in localStorage
 * and sends it with every protected request.
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/*
 * POST /api/auth/register
 *
 * Registers a new user.
 * Steps:
 *   1. Check if email already exists in the database.
 *   2. If not, create a new User document.
 *   3. The User model's pre-save hook hashes the password automatically.
 *   4. Generate and return a JWT token so user is logged in immediately.
 *
 * Request body: { fullName, email, password }
 * Response: { token, user: { id, fullName, email } }
 */
router.post('/register', async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    /* Check for missing fields */
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    /* Check if user already exists */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    /* Password length validation */
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    /* Create user - password is hashed inside the model's pre-save hook */
    const user = await User.create({ fullName, email, password });

    res.status(201).json({
      token: generateToken(user),
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/*
 * POST /api/auth/login
 *
 * Logs in an existing user.
 * Steps:
 *   1. Find user by email in the database.
 *   2. Compare entered password with stored hashed password using bcrypt.
 *   3. If they match, generate and return a JWT token.
 *
 * Request body: { email, password }
 * Response: { token, user: { id, fullName, email } }
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    /* Find user by email */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    /* Compare plain password with hashed password in DB */
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      token: generateToken(user),
      user: { id: user._id, fullName: user.fullName, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
