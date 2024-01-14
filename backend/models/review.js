const db = require('../utils/db_connection');
const model = require('../models/model');

module.exports = class Review extends model {
  constructor() {
    super('reviews');
  }

  static async getAvgReviewsPerUser() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT AVG(num_reviews) AS avg_reviews FROM (SELECT COUNT(*) AS num_reviews FROM reviews GROUP BY reviewee_id) AS t`;
      db.query(sql, [], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0].avg_reviews);
      });
    });
   }

   static async getTotalNumberOfRatings() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT COUNT(*) AS total_num_of_ratings FROM reviews`;
      db.query(sql, [], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0].total_num_of_ratings);
      });
    });
   }
};