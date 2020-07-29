const { instrument } = require('../models');

exports.getInstruments = async (req, res) => {
  try {
    const instruments = await instrument.findAll();
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

exports.putInstrument = async (req, res) => {
  try {
    const [rowsUpdated, [ updatedInstrument ]] = await instrument.update(
      {...req.body},
      {returning: true, where: {id: req.params.id}}
    );
    res.status(200);
    res.json(updatedInstrument);
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