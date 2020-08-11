const { instrument } = require('../models');

exports.getInstruments = async (req, res) => {
  try {
    const instruments = await instrument.findAll({
      order: [['id', 'asc']],
    });
    res.status(200);
    res.json(instruments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.putInstruments = async (req, res) => {
  try {
    // req.body is an array of instruments. The database has to be updated for each instrument individually
    for (let instr of req.body) {
      await instrument.update(
        { max_attendants: instr.max_attendants },
        { where: { id: instr.id } }
      );
    }
    // finally all the modified instruments are retrieved.
    // Don't change the order! It's important for the graphs display in the Groups component of the frontend.
    const updatedInstruments = await instrument.findAll({
      order: [['id', 'asc']],
    });
    res.status(200);
    res.json(updatedInstruments);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

// only used in development. Never accessed from the client.

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

exports.deleteInstrument = async (req, res) => {
  try {
    await instrument.destroy({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
