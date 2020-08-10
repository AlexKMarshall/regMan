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

const mockDeleteInstrument = [
  {
    id: 2,
    name: 'Viola',
    max_attendants: 8,
  },
];

const mockUpdateInstrument = [
  {
    id: 2,
    name: 'Viola',
    max_attendants: 6,
  },
];

const mockUpdatedInstruments = [
  {
    id: 1,
    name: 'Fiddle',
    max_attendants: 5,
  },
  {
    id: 2,
    name: 'Viola',
    max_attendants: 6,
  },
  {
    id: 3,
    name: 'Percussion',
    max_attendants: 2,
  },
];

const mockInstrumentEntry = {
  max_attendants: 3,
  name: 'Guitar',
};

const mockErrorEntryId = [
  {
    id: 22,
    name: 'Oboe',
    max_attendants: 2,
  },
];

const mockErrorEntryMA = {
  name: 'Cello',
};

const mockErrorEntryN = {
  max_attendants: 3,
};

function buildReq(mockBody) {
  const req = { body: mockBody, params: {} };
  return req;
}

function buildRes() {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    sendStatus: jest.fn(() => res).mockName('sendStatus'),
  };
  return res;
}

module.exports = {
  mockInstruments,
  mockInstrumentEntry,
  mockDeleteInstrument,
  mockUpdateInstrument,
  mockUpdatedInstruments,
  mockErrorEntryId,
  mockErrorEntryMA,
  mockErrorEntryN,
  buildReq,
  buildRes,
};
