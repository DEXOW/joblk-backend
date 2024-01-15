const Model = require('./model');
const db = require('../utils/db_connection');

module.exports = class Message extends Model {
  constructor() {
    super('messages');
  }

  getByConversationId(conversationId) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${this.table} WHERE conversation_id = ?`, [conversationId], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }
};