import ApiClient from './ApiClient';
import { buildInstrument } from '@test/test-utils';
import { server, rest } from './../test/server/test-server';

const apiUrl = process.env.REACT_APP_API_URL;

test('getInstruments', async () => {
  const instrumentData = [buildInstrument(), buildInstrument()];
  server.use(
    rest.get(`${apiUrl}/instruments`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(instrumentData));
    })
  );

  const returnedData = await ApiClient.getInstruments();

  expect(returnedData).toEqual(instrumentData);
});
