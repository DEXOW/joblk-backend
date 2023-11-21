const nodemailer = require("nodemailer");

// Create a SMTP transporter object
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3870e82622dffc",
    pass: "de858783320fc7"
  }
});

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