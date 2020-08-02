const { instrument } = require('../models');

exports.getInstruments = async (req, res) => {
  try {
    const instruments = await instrument.findAll({
      order: [['id', 'asc']]
    });
    res.status(200);
    res.json(instruments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.postInstrument = async (req, res) => {
  try {
    const newInstrument = await instrument.create(req.body);
    res.status(201);
    res.json(newInstrument);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.putInstruments = async (req, res) => {
  try {
    let i = 0;
    const instr = req.body;
    await instrument.update({max_attendants: instr[i].max_attendants}, {where: {id: instr[i].id}});
    i++;
    await instrument.update({max_attendants: instr[i].max_attendants}, {where: {id: instr[i].id}});
    i++;
    await instrument.update({max_attendants: instr[i].max_attendants}, {where: {id: instr[i].id}});
    i++;
    await instrument.update({max_attendants: instr[i].max_attendants}, {where: {id: instr[i].id}});
    i++;
    await instrument.update({max_attendants: instr[i].max_attendants}, {where: {id: instr[i].id}});
    const updatedInstruments = await instrument.findAll({
      order: [['id', 'asc']]
    });
    res.status(200);
    res.json(updatedInstruments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.deleteInstrument = async (req, res) => {
  try {
    await instrument.destroy({where: {id: req.params.id}});
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}