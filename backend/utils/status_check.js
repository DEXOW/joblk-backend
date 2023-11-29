const db = require("./db_connection");
const nodemailer = require("../controllers/nodemailer");

exports.dbStatus = function () {
  return new Promise((resolve, reject) => {
    try {
      db.connect((err) => {
        if (err) {
          resolve({ code: "ERROR", message: err  });
        }
        resolve('OK');
      });
    } catch (err) {
      reject({ code: "ERROR", message: err  });
    }
  });
};

exports.mailStatus = function () {
  return new Promise((resolve, reject) => {
    try {
      nodemailer.transport.verify((err, success) => {
        if (err) {
          resolve({ code: "ERROR", message: err  });
        }
        resolve('OK');
      });
    } catch (err) {
      reject({ code: "ERROR", message: err  });
    }
  });
};