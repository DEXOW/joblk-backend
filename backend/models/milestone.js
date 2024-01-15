const Model = require('./model');
const db = require('../utils/db_connection');

module.exports = class Message extends Model {
    constructor() {
        super('milestones');
    }
};