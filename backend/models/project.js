const Model = require('./model');
const db = require('../utils/db_connection');

module.exports = class Message extends Model {
    constructor() {
        super('projects');
    }

    static async getProjectsByUserId(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT projects.* 
            FROM projects 
            JOIN jobs ON projects.job_id = jobs.id 
            WHERE jobs.client_id = ? OR jobs.freelancer_id = ?
        `;
            db.query(sql, [userId, userId], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        })
    }
};