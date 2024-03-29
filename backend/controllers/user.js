const db = require('../utils/db_connection');
const User = require('../models/user');
const uploadImage = require('../utils/upload_image');
const md5 = require('md5');

const validate = require('../utils/validate');

exports.getUser = (req, res) => {
  const user = new User();
  if (req.user.id) {
    user.get(req.user.id).then(result => {
      // Remove password from user object
      const { password, ...userData } = result;
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

exports.getUserDetails = (req, res) => {
  const user = new User();
  const userId = req.params.id;

  user.getUserDetails(userId)
    .then(results => {
      res.send(results);
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};

exports.getAllUsers = (req, res) => {
  const user = new User();

  user.getAll()
    .then(async (users) => {
      // Remove password and id from each user
      const usersWithoutPasswordAndId = await Promise.all(users.map(async (result) => {
        const { password, ...userWithoutPassword } = result;
        const averageRating = await user.getAverageRating(result.id);
        userWithoutPassword.averageRating = averageRating ?? 0;
        return userWithoutPassword;
      }));

      res.send(usersWithoutPasswordAndId);
    })
    .catch((err) => {
      res.status(500).send({ message: 'Could not retrieve users', err });
    });
};

exports.updateUser = (req, res) => {
  const { username, full_name, email, city, province, country, mode_preference } = req.body;

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

  if (mode_preference) {
    updatedFields.mode_preference = mode_preference;
  }

  if (Object.keys(updatedFields).length === 0) {
    res.status(400).send({ code: "ERR-MISSING-BODY", message: 'No fields to update' });
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

exports.getSocials = (req, res) => {
  db.query('SELECT * FROM socials WHERE user_id = ?', [req.user.id], (err, results) => {
    if (err) {
      res.status(500).send({ code: "ERR-500", message: err });
      return;
    }
    if (results.length === 0) {
      res.status(404).send({ code: "ERR-404", message: 'Socials not found' });
      return;
    }
    const { id, user_id, ...socials } = results[0];
    res.send(socials);
  });
}

exports.updateSocials = (req, res) => {
  const { instagram, linkedIn, github, facebook, x } = req.body;

  const updatedFields = {};

  if (instagram) {
    if (!validate.validateLink(instagram)) {
      res.status(400).send({ code: "ERR-INVALID-CRED", message: 'Invalid instagram link' });
      return;
    }
    updatedFields.instagram = instagram;
  }

  if (linkedIn) {
    if (!validate.validateLink(linkedIn)) {
      res.status(400).send({ code: "ERR-INVALID-CRED", message: 'Invalid linkedIn link' });
      return;
    }
    updatedFields.linkedIn = linkedIn;
  }

  if (github) {
    if (!validate.validateLink(github)) {
      res.status(400).send({ code: "ERR-INVALID-CRED", message: 'Invalid github link' });
      return;
    }
    updatedFields.github = github;
  }

  if (facebook) {
    if (!validate.validateLink(facebook)) {
      res.status(400).send({ code: "ERR-INVALID-CRED", message: 'Invalid facebook link' });
      return;
    }
    updatedFields.facebook = facebook;
  }

  if (x) {
    if (!validate.validateLink(x)) {
      res.status(400).send({ code: "ERR-INVALID-CRED", message: 'Invalid x link' });
      return;
    }
    updatedFields.x = x;
  }

  if (Object.keys(updatedFields).length === 0) {
    res.status(400).send({ code: "ERR-MISSING-BODY", message: 'No fields to update' });
    return;
  }

  db.query('SELECT * FROM socials WHERE user_id = ?', [req.user.id], (err, results) => {
    if (err) {
      res.status(500).send({ code: "ERR-500", message: err });
      return;
    }
    if (results.length === 0) {
      db.query('INSERT INTO socials SET ?', { user_id: req.user.id, ...updatedFields }, (err, results) => {
        if (err) {
          res.status(500).send({ code: "ERR-500", message: err });
          return;
        }
        res.send({ message: 'Socials updated' });
      });
    } else {
      db.query('UPDATE socials SET ? WHERE user_id = ?', [updatedFields, req.user.id], (err, results) => {
        if (err) {
          res.status(500).send({ code: "ERR-500", message: err });
          return;
        }
        if (results.changedRows > 0) {
          res.send({ message: 'Socials updated' });
        } else {
          res.send({ message: 'No changes made' });
        }
      });
    }
  });

}

exports.deleteUser = (req, res) => {
  const { password } = req.body;

  const user = new User();

  if (!password) {
    res.status(400).send({ code: "ERR-MISSING-BODY", message: 'Missing credentials' });
    return;
  }

  if (md5(password) !== req.user.password) {
    res.status(401).send({ code: "ERR-INVALID-CRED", message: 'Invalid credentials' });
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

exports.updatePassword = async (req, res) => {
  const { currentPass, newPass, confPass } = req.body;
  const user = new User();
  let userData = null;

  await user.get(req.user.id).then(result => {
    userData = result;
  });

  if (!currentPass || !newPass || !confPass) {
    res.status(400).send({ code: "ERR-MISSING-BODY", message: 'Missing credentials' });
    return;
  }

  if (md5(currentPass) !== userData.password) {
    res.status(401).send({ code: "ERR-INVALID-CRED", message: 'Invalid password' });
    return;
  }

  if (md5(newPass) === userData.password) {
    res.status(400).send({ code: "ERR-INVALID-CRED", message: 'New password cannot be the same as the old one' });
    return;
  }

  if (newPass !== confPass) {
    res.status(400).send({ code: "ERR-INVALID-CRED", message: 'Passwords do not match' });
    return;
  }

  user.update(req.user.id, { password: md5(newPass) })
    .then(result => {
      if (result.changedRows > 0) {
        res.clearCookie('jwt').send({ message: 'Password updated' });
      } else {
        res.send({ message: 'No changes made' });
      }
    })
    .catch(err => {
      res.send(err);
    });
}

exports.updateAvatar = async (req, res) => {
  const avatar = req.files[0];
  const user = new User();

  if (!avatar) {
    res.status(400).send({ code: "ERR-MISSING-BODY", message: 'Missing file' });
    return;
  }

  let avatarUrl = await uploadImage(avatar);

  user.update(req.user.id, { avatar: avatarUrl })
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