const statusCheck = require("./status_check");

module.exports.startUpLogs = async () => {
  // Print server info and status logs
  console.log('-----------------------------------');
  console.log('\x1b[1m\x1b[4m%s\x1b[0m', 'Server info:\n');
  console.log('\x1b[34m%s\x1b[0m', `Start time : ${new Date().toISOString()}`);
  console.log('\x1b[34m%s\x1b[0m', `Environment: ${process.env.NODE_ENV}`);
  console.log('-----------------------------------');

  // Status check
  console.log('\x1b[1m\x1b[4m%s\x1b[0m', 'Status check:\n');
  if (await statusCheck.dbStatus() === 'OK') {
    console.log('\x1b[32m%s\x1b[0m', 'Database: CONNECTED ✔');
  } else {
    console.log('\x1b[31m%s\x1b[0m', 'Database: FAILED ✘');
  }

  if (await statusCheck.mailStatus() === 'OK') {
    console.log('\x1b[32m%s\x1b[0m', 'Mail: CONNECTED ✔');
  } else {
    console.log('\x1b[31m%s\x1b[0m', 'Mail: FAILED ✘');
  }
  console.log('-----------------------------------');
  console.log('\x1b[1m%s\x1b[0m', `API listening on port ${process.env.PORT}!`);
};