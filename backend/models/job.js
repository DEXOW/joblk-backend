const db = require('../utils/db_connection');
const model = require('../models/model');

module.exports = class Job extends model {
  constructor() {
    super('jobs');
  }

  static async findById(job_id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM jobs WHERE id = ?`;
      db.query(sql, [job_id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0]);
      });
    });
  }

  static async getBudgetById(job_id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT budget FROM jobs WHERE id = ?`;
      db.query(sql, [job_id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0].budget);
      });
    });
  }

  static async updateFreelancerIdAndStatus(job_id, freelancer_id, budget) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE jobs SET freelancer_id = ?, job_status = ?, budget = ? WHERE id = ?`;
      db.query(sql, [freelancer_id, 2, budget, job_id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  } 
};