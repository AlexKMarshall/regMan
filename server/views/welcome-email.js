const moment = require('moment');

exports.welcomeEmail = (participant) => {
  return `
    <div>
      <h3>Hello ${participant.first_name}!!</h3>
      <p>We've received your registration and we want to welcome you to Crisol de Cuerda!</p>
      <p>Here are the details that you've provided us. Let us know if we have to correct any of them:</p>
      <ul>
        <li>Name: ${participant.first_name}</li>
        <li>Surname: ${participant.last_name} </li>
        <li>Email: ${participant.email} </li>
        <li>Date of birth: ${moment(participant.date_of_birth).format('DD-MM-YYYY')} </li>
        <li>Street: ${participant.street} </li>
        <li>City: ${participant.city} </li>
        <li>Country: ${participant.country} </li>
        <li>Instrument: ${participant.instrument} </li>
        <li>Allergies: ${participant.allergies} </li>
      </ul>
      <p>You're registration will be complete once we receive the payment of ${(participant.amount_due / 100).toFixed(2)} €.</p>
      <p>We will send you a confirmation email once the payment has been received.</p>
      <br/>
      <p>Don't hessitate to contact us for further information.</p>
    </div>`
}