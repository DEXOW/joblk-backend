exports.auth_request = (req, res, next) => {
  if (req.headers.auth_token === process.env.AUTH_TOKEN) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

exports.auth = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send({ code: "ERR-UNAUTHORIZED", message: 'Unauthorized' });
  }
}