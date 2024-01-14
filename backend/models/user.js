const db = require('../utils/db_connection');
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

  async getAverageRating(userId) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT AVG(rating) as averageRating FROM reviews WHERE reviewee_id = ?`, [userId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0].averageRating);
      });
    });
  }

  static async getTotalUsers() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) AS total FROM users`;
      db.query(sql, [], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0].total);
      });
    });
   }
}