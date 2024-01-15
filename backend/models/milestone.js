const Model = require('./model');
const db = require('../utils/db_connection');

module.exports = class Message extends Model {
    constructor() {
        super('milestones');
    }

    async getMilestonesByProjectId(projectId) {
        return new Promise((resolve, reject) => {
          const sql = `SELECT * FROM milestones WHERE project_id = ?`;
          db.query(sql, [projectId], (err, results) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(results);
          });
        });
      }
};