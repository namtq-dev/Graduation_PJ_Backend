const jwt = require('jsonwebtoken');

exports.generateToken = (payload, expires) => {
  return jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: expires });
};
