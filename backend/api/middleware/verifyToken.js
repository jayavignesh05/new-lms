const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  let token;
  if (req.method === 'GET' && req.query.token) {
    token = req.query.token;
  } else if (req.body && req.body.token) {
    token = req.body.token;
  }

  if (!token) {
    return res.status(401).json({ error: "Authentication token is required." });
  }

  jwt.verify(token, 'ZXERE235SSF', (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: "Token expired. Please log in again." });
      }
      console.error("❌ Token verification error:", err.name);
      return res.status(403).json({ error: "Invalid token." });
    }
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;