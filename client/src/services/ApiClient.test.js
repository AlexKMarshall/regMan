import ApiClient from './ApiClient';
import { buildParticipant } from '@test/test-utils';
import { server } from './../test/server/test-server';

test('post attandant', async () => {
  server.resetHandlers();
  const newParticipant = buildParticipant();

  const returnedData = await ApiClient.postNewAttendant(newParticipant);

  expect(returnedData).toEqual({ message: 'ok' });
});
