/* ==========================================================================
   JWT Token Generation Helper
   Signs a JSON Web Token with user ID payload for session auth
   ========================================================================== */

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'flutterhub_secret', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
