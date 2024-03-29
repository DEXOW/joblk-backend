// models/conversation.js
const Model = require('./model');
const db = require('../utils/db_connection');

module.exports = class Conversation extends Model {
    constructor() {
        super('conversations');
    }

    getByUserIds(userOneId, userTwoId) {
        return new Promise((resolve, reject) => {
            const query = `
        SELECT * FROM ${this.table} 
        WHERE (user_one_id = ? AND user_two_id = ?) 
        OR (user_one_id = ? AND user_two_id = ?)
      `;
            db.query(query, [userOneId, userTwoId, userTwoId, userOneId], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results[0] || null);
            });
        });
    }

    //Get conversation according to a job id. The job contains the client_id and freelancer_id if they both have a conversation return the conversation details
    getConversationByJobId(id) {
        return new Promise((resolve, reject) => {
            const query = `
        SELECT c.id, c.user_one_id, c.user_two_id, c.created_at, c.updated_at, u1.username AS user_one_username, u2.username AS user_two_username
        FROM ${this.table} c
        JOIN users u1 ON c.user_one_id = u1.id
        JOIN users u2 ON c.user_two_id = u2.id
        JOIN jobs j ON c.user_one_id = j.client_id AND c.user_two_id = j.freelancer_id
        WHERE j.id = ?
      `;
            db.query(query, [id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results[0]);
            });
        });
    }

    getConversationsByUserId(id) {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT c.id, c.user_one_id, c.user_two_id, c.created_at, c.updated_at, u1.username AS user_one_username, u2.username AS user_two_username, ANY_VALUE(m.message_content) AS last_message, COUNT(m_unread.id) AS unread_messages
                FROM ${this.table} c
                JOIN users u1 ON c.user_one_id = u1.id
                JOIN users u2 ON c.user_two_id = u2.id
                LEFT JOIN (
                    SELECT message_content, conversation_id
                    FROM messages
                    WHERE id IN (
                        SELECT MAX(id)
                        FROM messages
                        GROUP BY conversation_id
                    )
                ) m ON m.conversation_id = c.id
                LEFT JOIN (
                    SELECT id, conversation_id
                    FROM messages
                    WHERE read_status = 0 AND sender_id != ?
                ) m_unread ON m_unread.conversation_id = c.id
                WHERE c.user_one_id = ? OR c.user_two_id = ?
                GROUP BY c.id
            `;
            db.query(query, [id, id, id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
    }


    checkUserExists(id) {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM users WHERE id = ?`, [id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results[0] || null);
            });
        });
    }
};
