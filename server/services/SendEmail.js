const nodemailer = require('nodemailer');
const { welcomeEmail } = require('../views/welcome-email');
const { waitlist } = require('../views/wait-list');
const { paymentStatus } = require('../views/paymentStatus');

// used to handle sending emails. It'll accept the emailData and a parameter that
// selects the type of email to be sent.
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

  // Calls the different email bodies
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

  // information to connect to the email provider account
  let transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // actual body of the email.
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

