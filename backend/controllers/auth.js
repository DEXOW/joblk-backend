const db = require('../utils/db_connection');
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const validate = require('../utils/validate');
const User = require('../models/user');
const nodemailer = require('./nodemailer');
const { emailTemplate } = require('../utils/otp_email_template');

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds
function createToken (id, email) {
  return jwt.sign({ id, email }, process.env.SESSION_TOKEN_KEY, {
    expiresIn: maxAge,
  });
};

exports.register = (req, res) => {

  // Check if user is already logged in
  if (req.cookies.jwt) {
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

    // Check if user exists
    if (results.length) {
      res.status(409).send({ code:"ERR-USER-EXISTS", message: 'User already exists' });
      return;
    }

    // Insert user into database
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
  if (req.cookies.jwt) {
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

      // Check if user exists
      if (!results.length) {
        res.status(401).send({ code: "ERR-INVALID-CRED", message: 'Invalid login credentials' });
        return;
      }

      // Check if password is correct
      if (results[0].password !== md5(password)) {
        res.status(401).send({ code:"ERR-INVALID-CRED", message: 'Invalid login credentials' });
        return;
      }

      res.cookie('jwt', createToken(results[0].id, email), { httpOnly: true, sameSite: 'none', secure: true }).send({ code: "SUCCESS", message: 'User logged in successfully' });
    });

  } else {

    //Check if user exists
    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
      if (err) {
        res.status(500).send({ code:"ERR-FAIL", message: 'Could not log in' });
        return;
      }

      // Check if user exists
      if (!results.length) {
        res.status(401).send({ code: "ERR-INVALID-CRED", message: 'Invalid login credentials' });
        return;
      }

      // Check if password is correct
      if (results[0].password !== md5(password)) {
        res.status(401).send({ code:"ERR-INVALID-CRED", message: 'Invalid login credentials' });
        return;
      }

      res.cookie('jwt', createToken(results[0].id, email), { httpOnly: true, maxAge: maxAge * 1000, sameSite: 'none', secure: true }).send({ code: "SUCCESS", message: 'User logged in successfully' });
    });
  }

}

exports.logout = (req, res) => {

  // Clearing the cookie
  res.clearCookie('jwt').send({ code: "SUCCESS", message: 'Logged out successfully' });
}

// Function to send the email using nodemailer
async function sendOTPMail(code, email, username) {
  return await nodemailer.sendMail({
    recipientAddress: email,
    recipientName: username,
    subject: "Verification Code",
    html: emailTemplate(code, "Verification Code")
  });
}

// Function to generate a 6 digit code
function generateOTP() {
  let code = Math.floor(Math.random() * 1000000); // Generating a random 6 digit number
  code = code.toString().padStart(6, '0'); // Padding the number with 0s to make it 6 digits
  return code;
}

async function sendOTP(email) {

  let email_verifications = [];
  let entryFlag = false;
  const user = new User();

  if (!email) {
    return { status: 400, code: "ERR-INVALID-EMAIL", message: "Missing parameters" };
  }

  if (!validate.validateEmail(email)) {
    return { status: 400, code: "ERR-INVALID-EMAIL", message: "Invalid email" };
  }

  if (!await user.getUserByEmail(email)) {
    return { status: 404, code: "ERR-USER-NOT-FOUND", message: "User not found" };
  }

  if (await user.getUserByEmail(email).then(result => { return result.verified_email; }) == 1) {
    return { status: 400, code: "ERR-EMAIL-ALREADY-VERIFIED", message: "Email already verified" };
  }

  email_verifications = await new Promise((resolve, reject) => {
    db.query('SELECT * FROM email_verifications WHERE email = ?', [email], async (err, results) => {
      if (err) {
        reject ({ status: 500, code:"ERR-FAIL", message: 'Could not send email' });
        return;
      }      
      resolve(results); // Storing the results in the email_verifications array
    });
  });

  if (email_verifications.length > 0) {
    // Check if the last email was sent less than 1 minutes ago
    if (Date.now() - email_verifications[0].modified_at < 60000) {
      return { status: 429, code: "ERR-TOO-MANY-REQUESTS", message: "Too many requests" };
    }

    let code = generateOTP();
    let currentTime = Date.now();

    let out = await new Promise((resolve, reject) => {
      db.query('UPDATE email_verifications SET code = ?, modified_at = ? WHERE email = ?', [code, currentTime, email], async (err, results) => {
        if (err) {
          reject({ status: 500, code:"ERR-FAIL", message: 'Could not send email' });            
        }

        await user.getUserByEmail(email).then(async result => {
          // Sending the email
          resolve(await sendOTPMail(code, email, result.username));
        }).catch(err => {
          reject({ status: 500, code:"ERR-FAIL", message: 'Could not send email' });
        });
      });
    }); 
    return out;
  } else {
    let code = generateOTP();
    let currentTime = Date.now();

    let out = await new Promise((resolve, reject) => {
      db.query('INSERT INTO email_verifications (email, code, modified_at) VALUES (?, ?, ?)', [email, code, currentTime], async (err, results) => {
        if (err) {
          reject({ status: 500, code:"ERR-FAIL", message: 'Could not send email' });
        }

        await user.getUserByEmail(email).then(async result => {
          // Sending the email
          resolve(await sendOTPMail(code, email, result.username));
        }).catch(err => {
          reject({ status: 500, code:"ERR-FAIL", message: 'Could not send email' });
        });
      });
    });
    return out;
  }
}

exports.emailVerification = async (req, res) => {
  // Getting the email from the query
  const { email } = req.query;

  // Sending OTP
  await sendOTP(email).then(result => {
    res.status(result.status).send(result);
  });
}

exports.verifyEmail = async (req, res) => {
  // Getting the email and code from the request body
  const { email, code } = req.query;

  // Check if email and code are missing
  if (!email || !code) {
    res.status(400).send({ code: "ERR-MISSING-PARAMS", message: "Missing parameters" });
    return;
  }

  // Check if email is valid
  if (!validate.validateEmail(email)) {
    res.status(400).send({ code: "ERR-INVALID-EMAIL", message: "Invalid email" });
    return;
  }

  // Check if code is valid
  if (!validate.validateOTP(code)) {
    res.status(400).send({ code: "ERR-INVALID-CODE", message: "Invalid code" });
    return;
  }

  // Check if user exists
  const user = new User();
  if (!await user.getUserByEmail(email)) {
    res.status(404).send({ code: "ERR-USER-NOT-FOUND", message: "User not found" });
    return;
  }

  // Check if the code is correct
  const email_verifications = await new Promise((resolve, reject) => {
    db.query('SELECT * FROM email_verifications WHERE email = ?', [email], (err, results) => {
      if (err) {
        reject({ status: 500, code:"ERR-FAIL", message: 'Could not verify email' });
        return;
      }
      resolve(results);
    });
  });

  if (email_verifications.length > 0) {
    if (email_verifications[0].code === code) {
      // Delete the entry from the database
      await new Promise((resolve, reject) => {
        db.query('DELETE FROM email_verifications WHERE email = ?', [email], (err, results) => {
          if (err) {
            reject({ status: 500, code:"ERR-FAIL", message: 'Could not verify email' });
            return;
          }
          resolve();
        });
      });

      // Update the user's verified_email column
      await new Promise((resolve, reject) => {
        db.query('UPDATE users SET verified_email = ? WHERE email = ?', [true, email], (err, results) => {
          if (err) {
            reject({ status: 500, code:"ERR-FAIL", message: 'Could not verify email' });
            return;
          }
          resolve();
        });
      });
    } else {
      res.status(400).send({ code: "ERR-INVALID-CODE", message: "Invalid code" });
      return;
    }
  } else {
    res.status(400).send({ code: "ERR-INVALID-CODE", message: "Invalid code" });
    return;
  }
  res.status(200).send({ code: "SUCCESS", message: "Email verified successfully" });
}