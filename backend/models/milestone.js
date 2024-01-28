const Model = require('./model');
const db = require('../utils/db_connection');

module.exports = class Milestone extends Model {
  constructor() {
    super('milestones');
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM milestones WHERE id = ?`;
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0]);
      });
    });
  }

  async findUsingJobId(jobId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM milestones WHERE job_id = ? ORDER BY order_number ASC`;
      db.query(sql, [jobId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static async findByJobId(jobId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM milestones WHERE job_id = ? ORDER BY order_number ASC`;
      db.query(sql, [jobId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static async updateById(id, data) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE milestones SET ? WHERE id = ?`;
      db.query(sql, [data, id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static async updateMilestones(milestones) {
    const updatedMilestones = milestones.map(async (milestone) => {
      await this.updateById(milestone.id, { budget: milestone.budget, status: milestone.status });
      return milestone;
    });

    return Promise.all(updatedMilestones);
  }

  async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE milestones SET status = ? WHERE id = ?`;
      db.query(sql, [status, id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static async getDueDateOfFinalMilestone(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT due_date FROM milestones WHERE job_id = ? ORDER BY order_number DESC LIMIT 1`;
      db.query(sql, [projectId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        if (results[0]) {
          resolve(results[0].due_date);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async getDueDateOfMostRecentMilestone(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT due_date FROM milestones WHERE job_id = ? AND order_number = (SELECT MAX(order_number) FROM milestones WHERE job_id = ? AND order_number != (SELECT MAX(order_number) FROM milestones WHERE job_id = ?))`;
      db.query(sql, [projectId, projectId, projectId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        if (results[0]) {
          resolve(results[0].due_date);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async getOrderNumberOfFinalMilestone(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT MAX(order_number) as maxOrderNumber FROM milestones WHERE job_id = ?`;
      db.query(sql, [projectId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0].maxOrderNumber);
      });
    });
  }

  static async incrementOrderNumber(orderNumber) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE milestones SET order_number = order_number + 1 WHERE order_number >= ?`;
      db.query(sql, [orderNumber], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static async decrementOrderNumbers(orderNumber) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE milestones SET order_number = order_number - 1 WHERE order_number > ?`;
      db.query(sql, [orderNumber], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static async updateStatus(id, status) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE milestones SET status = ? WHERE id = ?`;
      db.query(sql, [status, id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  static async calculateTotalPriority(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT SUM(priority) as totalPriority FROM milestones WHERE project_id = ?`;
      db.query(sql, [projectId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0].totalPriority);
      });
    });
  }
};
