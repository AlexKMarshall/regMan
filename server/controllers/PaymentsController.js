const { payment } = require('../models');
const { sendEmail } = require('../services/SendEmail'); // eslint-disable-line no-unused-vars

exports.getPaymentsByAttendantId = async (req, res) => {
  try {
    const payments = await payment.findAll({where: {attendantId: req.params.id}});
    res.status(200);
    res.json(payments)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

exports.postNewPayment = async (req, res) => {
  try {
    const newPayment = await payment.create(req.body);
    res.status(201);
    res.json(newPayment);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

exports.putUpdatePayment = async (req, res) => {
  try {
    const [rowsUpdated, [ updatedPayment ]] = await payment.update( // eslint-disable-line no-unused-vars
      {...req.body},
      {returning: true, where: {id: req.params.id}}
    );
    res.status(200)
    res.json(updatedPayment)
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

exports.sendStatus = async (req, res) => {
  try {
    const payments = await payment.findAll({where: {attendantId: req.body.attendantId}})
    req.body.payments = payments;
    sendEmail(req.body, 'payments');
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}