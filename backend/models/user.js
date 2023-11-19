const db = require('../controllers/db_connection');
const model = require('../models/model');

module.exports = class User extends model {
  constructor() {
    super('users');
  }

  getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${this.table} WHERE username = ?`, [username], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0]);
      });
    });
  }

  getUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${this.table} WHERE email = ?`, [email], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0]);
      });
    });
  }
}