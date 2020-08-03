const { attendant, instrument, payment } = require('../models');
const { sendEmail } = require('../services/SendEmail'); // eslint-disable-line no-unused-vars

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
    const [ selInstr ] = await instrument.findAll({where: {id: req.body.instrumentId}});
    const attendantsOnSelInstr = await attendant.findAll({where: {instrumentId: req.body.instrumentId, displayed: true}})

    if(attendantsOnSelInstr.length >= selInstr.max_attendants) req.body.registration_status = 'Waitlist';

    const newAttendant = await attendant.create(req.body);
    newAttendant.instrument = selInstr.name

    newAttendant.registration_status === 'New'
      ? sendEmail(newAttendant, 'welcome')
      : sendEmail(newAttendant, 'waitlist')
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

