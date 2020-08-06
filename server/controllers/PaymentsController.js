const { payment } = require("../models");
const { sendEmail } = require("../services/SendEmail"); // eslint-disable-line no-unused-vars
const moment = require("moment");

exports.getPaymentsByAttendantId = async (req, res) => {
  try {
    const payments = await payment.findAll({
      where: { attendantId: req.params.id },
    });
    res.status(200);
    res.json(payments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.postNewPayment = async (req, res) => {
  try {
    // guarantees a value for discounts and payment dates.
    if (req.body.type_of_payment === "Discount (5%)")
      req.body.amount_paid = (process.env.COURSE_PRICE * 5) / 100;
    if (!req.body.payment_date) req.body.payment_date = moment();

    const newPayment = await payment.create(req.body);
    res.status(201);
    res.json(newPayment);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.putUpdatePayment = async (req, res) => {
  try {
    // By default sequelize returns the number of updated rows. If returning is set to true, it retunrs an array
    // that has to be destructured to obtain the record value.
    const [rowsUpdated, [updatedPayment]] = await payment.update(
      // eslint-disable-line no-unused-vars
      { ...req.body },
      { returning: true, where: { id: req.params.id } }
    );
    res.status(200);
    res.json(updatedPayment);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.sendStatus = async (req, res) => {
  try {
    // Finds all payments of an attendant, attaches the payments in the req.body and passes the information to the email provider.
    // The req.body must be an object that contains the properties attendantId, email and first_name to be used in the sendEmail function.
    const payments = await payment.findAll({
      where: { attendantId: req.body.attendantId },
    });
    req.body.payments = payments;
    sendEmail(req.body, "payments");
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
