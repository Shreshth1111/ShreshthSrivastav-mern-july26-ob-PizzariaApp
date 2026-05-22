const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/* Schema defines the shape of each user document in MongoDB */
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,       /* No two users can have the same email */
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/*
 * Pre-save hook: runs automatically before every save().
 * Hashes the plain-text password using bcrypt so we never
 * store raw passwords in the database.
 * saltRounds=10 means bcrypt runs 2^10 = 1024 hashing iterations.
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/*
 * Instance method: compares a plain-text password with the
 * stored hashed password. Returns true if they match.
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
