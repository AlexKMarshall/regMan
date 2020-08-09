import ApiClient from './ApiClient';

test('the fetch function', async () => {
  const res = await ApiClient.fetchFromDb(`instruments`);

  expect(res).toEqual({ instruments: [{ name: 'guitar', max_attendants: 8 }] });
});
