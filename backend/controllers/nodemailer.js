const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3870e82622dffc",
    pass: "de858783320fc7"
  }
});

exports.sendMail = ({recipientAddress, recipientName, senderAddress='no-reply@job.lk', senderName ='Job.lk', subject, html, attachment=[], callback}) => {
  const mailOptions = {
    from: {
      name: senderName,
      address: senderAddress,
    },
    to: {
      name: recipientName,
      address: recipientAddress,
    },
    subject: subject,
    html: html,
    attachments: attachment,
  };
  transport.sendMail(mailOptions, callback);
}