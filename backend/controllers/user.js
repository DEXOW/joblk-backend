const User = require('../models/user');
const md5 = require('md5');

const validate = require('../utils/validate');

exports.getUser = (req, res) => {
  const user = new User();
  if (!req.query.id && !req.query.username && !req.query.email) {
    res.status(400).send({ code:"ERR-MISSING-PARAM", message: 'User ID, username or email is required' });
    return;
  }
  if (req.query.id) {
    user.get(req.query.id)
      .then(result => {
        // Remove password from user object
        const { password, ...user } = result;
        res.send(user);
      })
      .catch(err => {
        res.json(err);
      });
  } else if (req.query.username) {
    user.getUserByUsername(req.query.username)
      .then(result => {
        // Remove password from user object
        const { password, ...user } = result;
        res.send(user);
      })
      .catch(err => {
        res.json(err);
      });
  } else if (req.query.email) {
    user.getUserByEmail(req.query.email)
      .then(result => {
        // Remove password from user object
        const { password, ...user } = result;
        res.send(user);
      })
      .catch(err => {
        res.json(err);
      });
  }
}

exports.updateUser = (req, res) => {
  const { username } = req.body;
  
  const updatedFields = {};
  const user = new User();

  // Update only the fields that are passed in the request body
  if (username && validate.validateUsername(username)) {
    updatedFields.username = username;
  }

  if (Object.keys(updatedFields).length === 0) {
    res.status(400).send({ code:"ERR-MISSING-BODY", message: 'No fields to update' });
    return;
  }

  user.update(req.session.user.id, updatedFields)
    .then(result => {
      if (result.changedRows > 0) {
        user.get(req.session.user.id)
          .then(result => {
            req.session.user = result;

            // Remove password from user object
            const { password, ...user } = result;
            res.send(user);
          })
          .catch(err => {
            res.send(err);
          });
      } else {
        res.send({ message: 'No changes made' });
      }
    })
    .catch(err => {
      res.send(err);
    });
}

exports.deleteUser = (req, res) => {
  const { password } = req.body;
  
  const user = new User();

  if (!password) {
    res.status(400).send({ code:"ERR-MISSING-BODY", message: 'Missing credentials' });
    return;
  }

  if (md5(password) !== req.session.user.password) {
    res.status(401).send({ code:"ERR-INVALID-CRED", message: 'Invalid credentials' });
    return;
  }

  user.delete(req.session.user.id)
    .then(result => {
      if (result.affectedRows > 0) {
        res.send({ message: 'User deleted' });
      } else {
        res.send({ message: 'User not found' });
      }
    })
    .catch(err => {
      res.send(err);
    });
}

exports.updatePassword = (req, res) => {
  const { currentPass, newPass, confPass } = req.body;
  const user = new User();

  if (!currentPass || !newPass || !confPass) {
    res.status(400).send({ code:"ERR-MISSING-BODY", message: 'Missing credentials' });
    return;
  }

  if (md5(currentPass) !== req.session.user.password) {
    res.status(401).send({ code:"ERR-INVALID-CRED", message: 'Invalid password' });
    return;
  }

  if (md5(newPass) === req.session.user.password) {
    res.status(400).send({ code:"ERR-INVALID-CRED", message: 'New password cannot be the same as the old one' });
    return;
  }

  if (newPass !== confPass) {
    res.status(400).send({ code:"ERR-INVALID-CRED", message: 'Passwords do not match' });
    return;
  }

  user.update(req.session.user.id, { password: md5(newPass) })
    .then(result => {
      if (result.changedRows > 0) {
        req.session.destroy();
        res.send({ message: 'Password updated' });
      } else {
        res.send({ message: 'No changes made' });
      }
    })
    .catch(err => {
      res.send(err);
    });
}