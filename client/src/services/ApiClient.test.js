import ApiClient from './ApiClient';
import { buildInstrument } from '@test/test-utils';
import { server, rest } from './../test/server/test-server';

const apiUrl = process.env.REACT_APP_API_URL;

test('getInstruments', async () => {
  const instrumentData = [buildInstrument(), buildInstrument()];

  const endpoint = 'instruments';
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(instrumentData));
    })
  );

  const returnedData = await ApiClient.getInstruments();

  expect(returnedData).toEqual(instrumentData);
});

test('put Instruments requires auth token to be sent', async () => {
  const instruments = [buildInstrument(), buildInstrument()];
  const fakeToken = 'FAKE_TOKEN';
  const endpoint = 'instruments';

  let request;

  server.use(
    rest.put(`${apiUrl}/${endpoint}`, (req, res, ctx) => {
      request = req;
      return res(ctx.status(200), ctx.json(instruments));
    })
  );

  await ApiClient.putEditInstrument(instruments, fakeToken);

  expect(request.headers.get('Authorization')).toBe(`Bearer ${fakeToken}`);
});
