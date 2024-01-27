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

  getUserDetails(userId) {
    return new Promise((resolve, reject) => {
      const userQuery = `
            SELECT 
                users.id, users.username, users.full_name, users.email, users.avatar,
                JSON_OBJECT('instagram', ANY_VALUE(socials.instagram), 'linkedin', ANY_VALUE(socials.linkedin), 'github', ANY_VALUE(socials.github), 'facebook', ANY_VALUE(socials.facebook), 'twitter', ANY_VALUE(socials.x)) AS social_links
            FROM users
            LEFT JOIN socials ON users.id = socials.user_id
            WHERE users.id = ?
            GROUP BY users.id
        `;

      const projectsQuery = `
            SELECT 
                JSON_ARRAYAGG(JSON_OBJECT('title', portfolio_projects.title, 'description', portfolio_projects.description, 'url', portfolio_projects.url, 'images', JSON_ARRAY(portfolio_projects.image1, portfolio_projects.image2, portfolio_projects.image3, portfolio_projects.image4, portfolio_projects.image5))) AS projects
            FROM portfolio_projects
            WHERE portfolio_projects.uid = ?
        `;

      const reviewsQuery = `
        SELECT 
            JSON_ARRAYAGG(JSON_OBJECT('review_id', reviews.review_id, 'reviewer_id', reviews.reviewer_id, 'rating', reviews.rating, 'content', reviews.content, 'created_at', reviews.created_at, 'reviewer_username', users.username, 'reviewer_avatar', users.avatar)) AS reviews
        FROM reviews
        LEFT JOIN users ON reviews.reviewer_id = users.id
        WHERE reviews.reviewee_id = ?
    `;

      db.query(userQuery, [userId], (err, userResults) => {
        if (err) {
          reject(err);
          return;
        }

        db.query(projectsQuery, [userId], (err, projectsResults) => {
          if (err) {
            reject(err);
            return;
          }

          db.query(reviewsQuery, [userId], (err, reviewsResults) => {
            if (err) {
              reject(err);
              return;
            }

            const user = userResults[0];
            user.social_links = JSON.parse(userResults[0].social_links);
            user.projects = JSON.parse(projectsResults[0].projects);
            user.reviews = JSON.parse(reviewsResults[0].reviews);

            resolve(user);
          });
        });
      });
    });
  }
}