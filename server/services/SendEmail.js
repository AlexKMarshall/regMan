const nodemailer = require('nodemailer');

exports.sendEmail = async (attendantEmail, emailContent) => {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: `"Crisol App testing" <${process.env.GMAIL_FROM}>`,
    to: `${attendantEmail}, ${process.env.GMAIL_TO}`,
    subject: "Test Email from the new server",
    text: "Welcome to Crisol",
    html: emailContent,
  }, (err, data) => {
    if (err) console.log('Sending email failed: ', err);
    else console.log('Email sent');
  });
}

