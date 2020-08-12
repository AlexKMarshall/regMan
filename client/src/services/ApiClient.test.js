import ApiClient from './ApiClient';
import { buildInstrument, buildParticipant } from '@test/test-utils';
import { server, rest } from './../test/server/test-server';

const apiUrl = process.env.REACT_APP_API_URL;

const fakeInstruments = [buildInstrument(), buildInstrument()];

test('getInstruments', async () => {
  server.use(
    rest.get(`${apiUrl}/instruments`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(fakeInstruments));
    })
  );

  const returnedData = await ApiClient.getInstruments();
  expect(returnedData).toEqual(fakeInstruments);
});

test('put Instruments requires auth token to be sent', async () => {
  const fakeToken = 'FAKE_TOKEN';
  let request;

  server.use(
    rest.put(`${apiUrl}/instruments`, (req, res, ctx) => {
      request = req;
      return res(ctx.status(200), ctx.json(fakeInstruments));
    })
  );

  await ApiClient.updateInstruments(fakeInstruments, fakeToken);

  expect(request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
});

test('post attandant', async () => {
  server.resetHandlers();
  const newParticipant = buildParticipant();

  const returnedData = await ApiClient.postNewAttendant(newParticipant);

  expect(returnedData).toEqual({ message: 'ok' });
});
