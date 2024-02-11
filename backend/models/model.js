const db = require('../utils/db_connection');

module.exports = class Model {
  constructor(table) {
    this.table = table;
  }

  get(id) {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results[0]);
      });
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM ${this.table}`, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  create(data) {
    return new Promise((resolve, reject) => {
      db.query(`INSERT INTO ${this.table} SET ?`, [data], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results.insertId);
      });
    });
  }

  update(id, data) {
    return new Promise((resolve, reject) => {
      db.query(`UPDATE ${this.table} SET ? WHERE id = ?`, [data, id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      db.query(`DELETE FROM ${this.table} WHERE id = ?`, [id], (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results);
      });
    });
  }
}