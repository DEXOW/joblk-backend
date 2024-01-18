const Model = require('./model');
const db = require('../utils/db_connection');

module.exports = class Message extends Model {
    constructor() {
        super('projects');
    }

    static async getProjectsForClient(client_id) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT projects.id, projects.job_id, projects.status, jobs.client_id, jobs.freelancer_id, jobs.job_status, jobs.title, jobs.description, jobs.job_tags, jobs.images_files_documents, jobs.experience_level, jobs.required_skills, jobs.communication_method, jobs.language_proficiency, jobs.category, jobs.sub_category, jobs.duration, jobs.budget, jobs.deadline, jobs.milestones, jobs.views, jobs.clicks
            FROM projects 
            JOIN jobs ON projects.job_id = jobs.id 
            WHERE jobs.client_id = ?
        `;
            db.query(sql, [client_id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        })
    }

    static async getProjectsForFreelancer(freelancer_id) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT projects.id, projects.job_id, projects.status, jobs.client_id, jobs.freelancer_id, jobs.job_status, jobs.title, jobs.description, jobs.job_tags, jobs.images_files_documents, jobs.experience_level, jobs.required_skills, jobs.communication_method, jobs.language_proficiency, jobs.category, jobs.sub_category, jobs.duration, jobs.budget, jobs.deadline, jobs.milestones, jobs.views, jobs.clicks
            FROM projects 
            JOIN jobs ON projects.job_id = jobs.id 
            WHERE jobs.freelancer_id = ?
        `;
            db.query(sql, [freelancer_id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        })
    }

    static async updateProjectStatusAndPaymentStatus(id, status, payment_status) {
        return new Promise((resolve, reject) => {
            const sql = `
            UPDATE projects SET status = ?, payment_status = ? WHERE id = ?
        `;
            db.query(sql, [status, payment_status, id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        })
    }

    static async getJobByProjectId(projectId) {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT * FROM jobs WHERE id = (SELECT job_id FROM projects WHERE id = ?)
        `;
            db.query(sql, [projectId], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results[0]);
            });
        })
    }
};