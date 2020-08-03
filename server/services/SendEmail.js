const nodemailer = require('nodemailer');
const { welcomeEmail } = require('../views/welcome-email');
const { waitlist } = require('../views/wait-list');
const { paymentStatus } = require('../views/paymentStatus');


exports.sendEmail = async (emailData, typeOfMail) => {
  function subject () {
    switch (typeOfMail) {
      case 'welcome':
        return 'Welcome to Crisol!'
      case 'waitlist':
        return "We're sorry, you're on the waitlist"
      case 'payments':
        return "We've received your payment!"
    }
  }

  function emailContent () {
    switch (typeOfMail) {
      case 'welcome':
        return welcomeEmail(emailData);
      case 'waitlist':
        return waitlist(emailData);
      case 'payments':
        return paymentStatus(emailData);
    }
  }

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  transporter.sendMail({
    from: `"Crisol App testing" <${process.env.GMAIL_FROM}>`,
    to: `${emailData.email}, ${process.env.GMAIL_TO}`,
    subject: subject(),
    text: "Information from Crisol de Cuerda",
    html: emailContent(),
  }, (err, data) => {
    if (err) console.log('Sending email failed: ', err);
    else console.log('Email sent 🎉🎉: ', data);
  });
}

