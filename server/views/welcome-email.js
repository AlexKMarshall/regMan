const moment = require('moment');

// html of the welcome email. css has to be hardcoded for nodemail to interpret it correctly
exports.welcomeEmail = (participant) => {
  return `
  <!DOCTYPE html>
  <html>
    <body>
      <div class="email" style="width: 100%; display: flex; justify-content: center; background-color: #f4f3f1">
        <div class="mail-body" style="background-color: #f2e0ce; max-width: 600px; margin: 0 auto">
          <div class="header" style="background-image: url('http://www.crisoldecuerda.com/wp-content/uploads/2020/01/Crisol-345.jpg'); background-size: cover; width: 100%; height: 250px;"></div>
          <div class="text" style="padding: 0 20px;">
            <h3>Hello ${participant.first_name}!!</h3>
            <p>We've received your registration and we want to welcome you to Crisol de Cuerda!</p>
            <p>Here are the details that you've provided us. Let us know if we have to correct any of them:</p>
            <ul>
              <li>Name: ${participant.first_name}</li>
              <li>Surname: ${participant.last_name} </li>
              <li>Email: ${participant.email} </li>
              <li>Date of birth: ${moment(participant.date_of_birth).format(
                'DD-MM-YYYY'
              )} </li>
              <li>Street: ${participant.street} </li>
              <li>City: ${participant.city} </li>
              <li>Country: ${participant.country} </li>
              <li>Instrument: ${participant.instrument} </li>
              <li>Allergies: ${participant.allergies} </li>
            </ul>
            <p>Your registration will be complete once we receive the downpayment of 60€.</p>
            <p>We will send you a confirmation email once the payment has been received.</p>
            <p>Don't hessitate to contact us for further information.</p>
            <p>See you this summer!</p>
            <div class="signature" style="background-image: url(http://www.crisoldecuerda.com/wp-content/uploads/2012/02/logo-black11.png); width: 180px; height: 52px; margin: 0 0 30px 0;"></div>
          </div>
        </div>
      </div>
    </body>
  </html>
`;
};
