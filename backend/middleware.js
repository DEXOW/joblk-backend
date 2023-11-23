const jwt = require("jsonwebtoken");

exports.auth_request = (req, res, next) => {
  if (req.headers.auth_token === process.env.AUTH_TOKEN) {
    next();
  } else {
    res.status(401).json({ code: "ERR-INVALID-TOKEN", message: 'Unauthorized token' });
  }
}

exports.auth = (req, res, next) => {
  const token = req.cookies.jwt;
  
  if (!token) return res.status(401).send("Access denied. No token provided.");
  
  jwt.verify(token, process.env.SESSION_SECRET, (err, payload) => {

    if (err) return res.status(403).send("Token is not valid!");
    
    const { iat, exp, ...user } = payload;
    req.user = user;

    next();
  });
}