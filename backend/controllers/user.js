const User = require('../models/user');
const md5 = require('md5');

const validate = require('../utils/validate');

exports.getUser = (req, res) => {
  const user = new User();
  if (req.user.id) {
    user.get(req.user.id).then(result => {
      // Remove password from user object
      const { id, password, ...userData } = result;
      user.getAverageRating(req.user.id).then(averageRating => {
        userData.averageRating = averageRating;
        res.send(userData);
      }).catch(err => {
        res.status(500).send({ message: 'Could not retrieve average rating', err });
      });
    })
    .catch(err => {
      res.json(err);
    });
  }
}
exports.getAllUsers = (req, res) => {
  const user = new User();

  user.getAll()
    .then((users) => {
      // Remove password and id from each user
      const usersWithoutPasswordAndId = users.map(user => {
        const { id, password, ...userData } = user;
        return userData;
      });

      res.send(usersWithoutPasswordAndId);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Could not retrieve users', err });
    });
};

exports.updateUser = (req, res) => {
  const { username, full_name, email, city, province, country, avatar } = req.body;
  
  const updatedFields = {};
  const user = new User();

  // Update only the fields that are passed in the request body
  if (username && validate.validateUsername(username)) {
    updatedFields.username = username;
  }

  if (full_name && validate.validateName(full_name)) {
    updatedFields.full_name = full_name;
  }

  if (email && validate.validateEmail(email)) {
    updatedFields.email = email;
  }

  if (city) {
    updatedFields.city = city;
  }

  if (province) {
    updatedFields.province = province;
  }

  if (country) {
    updatedFields.country = country;
  }

  if (avatar) {
    updatedFields.avatar = avatar;
  }

  if (Object.keys(updatedFields).length === 0) {
    res.status(400).send({ code:"ERR-MISSING-BODY", message: 'No fields to update' });
    return;
  }

  user.update(req.user.id, updatedFields)
    .then(result => {
      if (result.changedRows > 0) {
        user.get(req.user.id)
          .then(result => {
            req.user = result;

            // Remove password from user object
            const { password, ...user } = result;
            res.send(user);
          })
          .catch(err => {
            res.send(err);
          });
      } else {
        res.status(200).send({ code: "SUCCESS", message: 'No changes made' });
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

  if (md5(password) !== req.user.password) {
    res.status(401).send({ code:"ERR-INVALID-CRED", message: 'Invalid credentials' });
    return;
  }

  user.delete(req.user.id)
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

  if (md5(currentPass) !== req.user.password) {
    res.status(401).send({ code:"ERR-INVALID-CRED", message: 'Invalid password' });
    return;
  }

  if (md5(newPass) === req.user.password) {
    res.status(400).send({ code:"ERR-INVALID-CRED", message: 'New password cannot be the same as the old one' });
    return;
  }

  if (newPass !== confPass) {
    res.status(400).send({ code:"ERR-INVALID-CRED", message: 'Passwords do not match' });
    return;
  }

  user.update(req.user.id, { password: md5(newPass) })
    .then(result => {
      if (result.changedRows > 0) {
        res.clearCookie('jwt').send({ code: "SUCCESS", message: 'Logged out successfully' });
        res.send({ message: 'Password updated' });
      } else {
        res.send({ message: 'No changes made' });
      }
    })
    .catch(err => {
      res.send(err);
    });
}