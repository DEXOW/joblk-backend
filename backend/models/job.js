const db = require('../utils/db_connection');
const model = require('../models/model');

module.exports = class Job extends model {
  constructor() {
    super('jobs');
  }
};