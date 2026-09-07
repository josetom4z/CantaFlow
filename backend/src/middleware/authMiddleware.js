const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'cantaflow_pixellab_secret_jwt_key_2026_production'
      );
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error('Auth Middleware Token Error:', error.message);
      return res.status(401).json({ message: 'Não autorizado, token inválido' });
    }
  }

  // Allow guest/demo operations if no token provided or fall back gracefully
  req.user = {
    _id: 'guest_user_id',
    name: 'Músico Convidado',
    email: 'convidado@cantaflow.pixellab.com',
    plan: req.headers['x-plan'] || 'free',
  };
  next();
};

module.exports = { protect };
