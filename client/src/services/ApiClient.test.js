import { server, rest } from './../test/server/test-server';
import { client } from './ApiClient';

const apiURL = process.env.REACT_APP_API_URL;

test('calls fetch at the endpoint with the arguments for GET requests', async () => {
  const endpoint = 'test-endpoint';
  const mockResult = { mockValue: 'VALUE' };
  server.use(
    rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
      return res(ctx.json(mockResult));
    })
  );

  const result = await client(endpoint);

  expect(result).toEqual(mockResult);
});
