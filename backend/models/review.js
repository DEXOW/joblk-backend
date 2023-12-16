const db = require('../utils/db_connection');
const model = require('../models/model');

module.exports = class Review extends model {
  constructor() {
    super('reviews');
  }
};



