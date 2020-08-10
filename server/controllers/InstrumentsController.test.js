const controllers = require('./InstrumentsController');
const { instrument } = require('../models');
jest.mock('../models', () => ({ instrument: () => {} }));

const mockInstruments = [
  {
    id: 1,
    name: 'Fiddle',
    max_attendants: 5,
  },
  {
    id: 2,
    name: 'Viola',
    max_attendants: 8,
  },
  {
    id: 3,
    name: 'Percussion',
    max_attendants: 2,
  },
];

const req = {};
function buildRes() {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
  };
  return res;
}

describe('getInstruments', () => {
  it('should return pass instruments from DB to res.json', async () => {
    const res = buildRes();
    instrument.findAll = jest.fn();
    instrument.findAll.mockResolvedValue(mockInstruments);

    await controllers.getInstruments(req, res);
    expect(res.json).toHaveBeenCalledWith(mockInstruments);
  });
});
