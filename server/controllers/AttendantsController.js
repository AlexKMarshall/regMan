const { attendant, instrument, payment } = require('../models');
// const { sendEmail } = require('../services/SendEmail');
// const { welcomeEmail } = require('../views/welcome-email');

exports.getAll = async (req, res) => {
  try {
    const attendantsList = await attendant.findAll({
      attributes: [ 'id', 'first_name', 'last_name', 'is_underage', 'email', 'registration_status'],
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
    const newAttendant = await attendant.create(req.body);
    // sendEmail(newAttendant.email, welcomeEmail(newAttendant));
    res.status(201);
    res.json(newAttendant);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getDetails = async (req, res) => {
  try {
    const attendantDetails = await attendant.findAll({
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
    const [rowsUpdated, [ updatedAttendant ]] = await attendant.update(
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

