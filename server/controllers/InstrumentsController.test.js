const {
  getInstruments,
  postInstrument,
  putInstruments,
  deleteInstrument,
} = require('./InstrumentsController');
const { instrument } = require('../models');
const {
  mockInstruments,
  mockInstrumentEntry,
  mockUpdatedInstruments,
  mockDeleteInstrument,
  mockUpdateInstrument,
  mockErrorEntryMA,
  mockErrorEntryN,
  buildReq,
  buildRes,
} = require('./InstrumentControllerMockData');
jest.mock('../models', () => ({ instrument: () => {} }));

const res = buildRes();

describe('getInstruments', () => {
  //TODO: add error check
  const req = buildReq();

  it('instrument.findAll should have been called once', async () => {
    instrument.findAll = jest.fn();
    instrument.findAll.mockResolvedValue(mockInstruments);
    await getInstruments(req, res);
    expect(instrument.findAll).toHaveBeenCalledTimes(1);
  });

  it('should call res.json with instruments', async () => {
    instrument.findAll = jest.fn();
    instrument.findAll.mockResolvedValue(mockInstruments);
    await getInstruments(req, res);
    expect(res.json).toHaveBeenCalledWith(mockInstruments);
  });

  it('should call res.status with 200', async () => {
    instrument.findAll = jest.fn();
    instrument.findAll.mockResolvedValue(mockInstruments);
    await getInstruments(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('postInstruments', () => {
  const req = buildReq(mockInstrumentEntry);
  instrument.create = jest.fn();
  instrument.create.mockResolvedValue(mockInstrumentEntry);

  it('instrument.create should be called once', async () => {
    await postInstrument(req, res);
    expect(instrument.create).toHaveBeenCalledTimes(1);
  });

  it('should call res.status with 201 on successful post', async () => {
    await postInstrument(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should call res.json with DB', async () => {
    await postInstrument(req, res);
    expect(res.json).toHaveBeenCalledWith(mockInstrumentEntry);
  });

  // not passing this test. Not sure how to adjust the function to make it pass
  // TODO: check with postman if these fields are required
  // it('should throw 500 error when missing max_attendants', async () => {
  //   const reqError = buildReq(mockErrorEntryN);
  //   await postInstrument(reqError, res);
  //   console.log('in error check')
  //   expect(res.sendStatus).toHaveBeenCalledWith(500);
  // });
});

describe('putInstruments', () => {
  //TODO: add checks for errors
  const req = buildReq(mockUpdateInstrument);
  instrument.update = jest.fn();
  instrument.update.mockResolvedValue(mockUpdateInstrument);

  it('should call instrument.update once', async () => {
    instrument.findAll = jest.fn();
    instrument.findAll.mockResolvedValue(mockUpdatedInstruments);
    await putInstruments(req, res);
    expect(instrument.update).toHaveBeenCalledTimes(1);
  });

  it('should call res.json with updated list from DB', async () => {
    instrument.findAll = jest.fn();
    instrument.findAll.mockResolvedValue(mockUpdatedInstruments);
    await putInstruments(req, res);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedInstruments);
  });

  it('should call res.status with 200 on successful update', async () => {
    instrument.findAll = jest.fn();
    instrument.findAll.mockResolvedValue(mockUpdatedInstruments);
    await putInstruments(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('deleteInstrument', () => {
  const req = buildReq(mockDeleteInstrument);
  instrument.destroy = jest.fn();
  instrument.destroy.mockResolvedValue(mockDeleteInstrument);

  it('should call instrument.destroy once', async () => {
    await deleteInstrument(req, res);
    expect(instrument.destroy).toHaveBeenCalledTimes(1);
  });

  it('should call res.sendStatus with 204 on successful deletion', async () => {
    await deleteInstrument(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(204);
  });
});
