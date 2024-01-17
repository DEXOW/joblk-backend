const Model = require('./model');
const db = require('../utils/db_connection');

module.exports = class Milestone extends Model {
  constructor() {
    super('milestones');
  }

  async getMilestonesByProjectId(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, project_id, name, description, due_date, status, order_number 
      FROM milestones WHERE project_id = ? ORDER BY order_number ASC`;
      db.query(sql, [projectId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  async getDueDateOfFinalMilestone(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT due_date FROM milestones WHERE project_id = ? ORDER BY order_number DESC LIMIT 1`;
      db.query(sql, [projectId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0].due_date);
      });
    });
  }

  async getDueDateOfMostRecentMilestone(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT due_date FROM milestones WHERE project_id = ? AND order_number = (SELECT MAX(order_number) FROM milestones WHERE project_id = ? AND order_number != (SELECT MAX(order_number) FROM milestones WHERE project_id = ?))`;
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

  async getOrderNumberOfFinalMilestone(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT MAX(order_number) as maxOrderNumber FROM milestones WHERE project_id = ?`;
      db.query(sql, [projectId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0].maxOrderNumber);
      });
    });
  }

  async incrementOrderNumber(orderNumber) {
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

  async getOrderNumber(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT order_number FROM milestones WHERE id = ?`;
      db.query(sql, [id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0].order_number);
      });
    });
  }

  async decrementOrderNumbers(orderNumber) {
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

  async getAllOrderedByOrderNumber() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM milestones WHERE status = 1 ORDER BY order_number ASC`;
      db.query(sql, (err, results) => {
        console.log(results);
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
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

  async getFinalMilestone(projectId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM milestones WHERE project_id = ? AND order_number = (SELECT MAX(order_number) FROM milestones WHERE project_id = ?)
    `;
      db.query(sql, [projectId, projectId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0]);
      });
    })
  }

  async addContent(id, content) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE milestones SET content = ? WHERE id = ?`;
        db.query(sql, [content, id], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });
 }
};
