const db = require("../controllers/db_connection");
const nodemailer = require("../controllers/nodemailer");

exports.dbStatus = function () {
  return new Promise((resolve, rejects) => {
    try {
      db.connect((err) => {
        if (err) {
          rejects({ code: "ERROR", message: err  });
        }
        resolve('OK');
      });
    } catch (err) {
      rejects({ code: "ERROR", message: err  });
    }
  });
};

exports.mailStatus = function () {
  return new Promise((resolve, rejects) => {
    try {
      // TODO: Fix this (Error occurs at this line)
      nodemailer.transport.verify((err, success) => {
        if (err) {
          rejects({ code: "ERROR", message: err  });
        }
        resolve('OK');
      });
    } catch (err) {
      rejects({ code: "ERROR", message: err  });
    }
  });
};