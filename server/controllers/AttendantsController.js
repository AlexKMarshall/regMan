const { attendant, instrument, payment } = require('../models');
const { sendEmail } = require('../services/SendEmail'); // eslint-disable-line no-unused-vars
const moment = require('moment')

exports.getAll = async (req, res) => {
  try {
    const attendantsList = await attendant.findAll({
      include: [{
        model: instrument,
        attributes: ['id', 'name']
      }],
      where: { displayed: true },
      order: [['last_name', 'asc']]
    });
    res.status(200);
    res.json(attendantsList);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.postNewAttendant = async (req, res) => {
  try {
    // find the max number of attendants for the requested instrument and the number of attendants already registered
    const [ selInstr ] = await instrument.findAll({where: {id: req.body.instrumentId}});
    const attendantsOnSelInstr = await attendant.findAll({where: {instrumentId: req.body.instrumentId, displayed: true}})
    // Change registration status if group is full.
    if(attendantsOnSelInstr.length >= selInstr.max_attendants) req.body.registration_status = 'Waitlist';
    // Create DB entry and store instrument name to be used in the email.
    const newAttendant = await attendant.create(req.body);
    newAttendant.instrument = selInstr.name
    // if attendant is underage, apply 5% discount
    newAttendant.is_underage && await payment.create({
      payment_date: moment(),
      amount_paid: 3000,
      type_of_payment: 'Discount (5%)',
      attendantId: newAttendant.id
    })
    // Send email depending on availability
    // newAttendant.registration_status === 'New'
    //   ? sendEmail(newAttendant, 'welcome')
    //   : sendEmail(newAttendant, 'waitlist')
    // send response to the client.
    res.status(201);
    res.json(newAttendant);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getDetails = async (req, res) => {
  try {
    const attendantDetails = await attendant.findOne({
      include: [
        instrument,
        {
          model: payment,
          as: 'payments'
        }
      ],
      where: {id: req.params.id}
    })
    res.status(200)
    res.json(attendantDetails);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.putDeleteAttendant = async (req, res) => {
  try {
     await attendant.update(
      {displayed: false},
      {where: {id: req.params.id}}
    );
    res.sendStatus(204)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

exports.putUpdateAttendant = async (req, res) => {
  try {
    const [rowsUpdated, [ updatedAttendant ]] = await attendant.update( // eslint-disable-line no-unused-vars
      {...req.body},
      {returning: true, where: {id: req.params.id}}
    );
    res.status(200)
    res.json(updatedAttendant)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

