const jwt = require('jsonwebtoken');

/*
 * protect middleware:
 * Reads the Authorization header, verifies the JWT token,
 * and attaches the decoded user info to req.user.
 * Any route that uses this middleware requires a valid login token.
 *
 * Usage: router.get('/protected', protect, handler)
 */
const protect = (req, res, next) => {
  let token;

  /* JWT is sent in the Authorization header as: "Bearer <token>" */
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Please log in.' });
  }

  try {
    /* Verify the token using our secret key */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; /* Attach user payload to the request */
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};

module.exports = protect;
