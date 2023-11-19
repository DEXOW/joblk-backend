const db = require('./db_connection');
const md5 = require('md5');
const { readFileSync } = require('fs');

const validate = require('../utils/validate');
const User = require('../models/user');
const nodemailer = require('./nodemailer');
const { emailTemplate } = require('../utils/otp-email-template');

exports.register = (req, res) => {

  // Check if user is already logged in
  if (req.session.user) {
    res.send({ code: "SUCCESS", message: 'User already logged in' });
    return;
  }

  //Get credentials from request body
  const { username, email, password } = req.body;

  // Check if credentials are missing
  if (!username || !email || !password) {
    res.status(400).send({ code: 'ERR-MISSING-CRED', message: 'Missing credentials' });
    return;
  }

  // Check if email is valid
  if (!validate.validateEmail(email)) {
    res.status(400).send({ code: 'ERR-INVALID-EMAIL', message: 'Invalid email' });
    return;
  }

  // Check if username is valid
  if (!validate.validateUsername(username)) {
    res.status(400).send({ code: 'ERR-INVALID-USERNAME', message: 'Invalid username' });
    return;
  }

  // Check if password is valid
  if (!validate.validatePassword(password)) {
    res.status(400).send({ code: 'ERR-INVALID-PASSWORD', message: 'Invalid password' });
    return;
  }

  // Check if user already exists
  db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, results) => {
    if (err) {
      res.status(500).send({ code:"ERR-FAIL", message: 'Could not register user' });
      return;
    }
    if (results.length) {
      res.status(409).send({ code:"ERR-USER-EXISTS", message: 'User already exists' });
      return;
    }
    // Create user
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, md5(password)], (err, results) => {
      if (err) {
        res.status(500).send({ code:"ERR-FAIL", message: 'Could not register user' });
        return;
      }
      res.send({ code:"SUCCESS", message: 'User registered successfully' });
    });
  });

}

exports.login = (req, res) => {

  // Check if user is already logged in
  if (req.session.user) {
    res.send({ code: "SUCCESS", message: 'User already logged in' });
    return;
  }

  //Get credentials from request body
  const { username, email, password } = req.body;

  // Check if credentials are missing
  if (!username && !email || !password) {
    res.status(400).send({ code: 'ERR-MISSING-CRED', message: 'Missing credentials' });
    return;
  }

  if (email && validate.validateEmail(email)) {
    
    //Check if user exists
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        res.status(500).send({ code:"ERR-FAIL", message: 'Could not log in' });
        return;
      }
      if (!results.length) {
        res.status(401).send({ code: "ERR-INVALID-CRED", message: 'Invalid login credentials' });
        return;
      }
      if (results[0].password !== md5(password)) {
        res.status(401).send({ code:"ERR-INVALID-CRED", message: 'Invalid login credentials' });
        return;
      }
      req.session.user = results[0];
      res.send({ code:"SUCCESS", message: 'Logged in successfully' });
    });

  } else {

    //Check if user exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        res.status(500).send({ code:"ERR-FAIL", message: 'Could not log in' });
        return;
      }
      if (!results.length) {
        res.status(401).send({ code: "ERR-INVALID-CRED", message: 'Invalid login credentials' });
        return;
      }
      if (results[0].password !== md5(password)) {
        res.status(401).send({ code:"ERR-INVALID-CRED", message: 'Invalid login credentials' });
        return;
      }
      req.session.user = results[0];
      res.send({ code:"SUCCESS", message: 'Logged in' });
    });
  }

}

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send({ message: 'Could not log out' });
      return;
    }
    res.clearCookie('connect.sid').send({ code: "SUCCESS", message: 'Logged out successfully' });
  });
}