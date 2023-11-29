const nodemailer = require("nodemailer");

// Create a SMTP transporter object
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

exports.transport = transport;

exports.sendMail = async ({recipientAddress, recipientName, senderAddress='no-reply@job.lk', senderName ='Job.lk', subject, html, attachment=[]}) => {
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

  try {
    await transport.sendMail(mailOptions);
    return { status: 200, code: "SUCCESS", message: 'Email sent' };
  } catch (err) {
    return { status: 500, code: "ERR-FAIL", message: 'Could not send email' };
  }
}