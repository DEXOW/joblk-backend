const db = require('../utils/db_connection');
const model = require('../models/model');

module.exports = class Review extends model {
  constructor() {
    super('reviews');
  }
  getAverageRating(userId) {
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
};



