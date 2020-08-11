import React from 'react';

import userEvent from '@testing-library/user-event';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  fireEvent,
  buildInstrument,
  buildParticipant,
} from '@test/test-utils';
import { server, rest } from './../../test/server/test-server';
import Form from './Form-new';

const apiUrl = process.env.REACT_APP_API_URL;

const fakeInstruments = [buildInstrument(), buildInstrument()];

test('user can register', async () => {
  let registrationRequest;

  server.use(
    rest.get(`${apiUrl}/instruments`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(fakeInstruments));
    }),
    rest.post(`${apiUrl}/inscriptions`, (req, res, ctx) => {
      console.log('post request');
      console.log(req);
      registrationRequest = req;
      return res(ctx.status(200), ctx.json({ message: 'ok' }));
    })
  );
  const newParticipant = buildParticipant({
    instrument: buildInstrument({ name: fakeInstruments[0].name }),
  });

  render(<Form />);

  await waitForElementToBeRemoved(() => screen.queryByLabelText(/loading/i));

  userEvent.type(screen.getByLabelText(/^name/i), newParticipant.first_name);
  userEvent.type(screen.getByLabelText(/surname/i), newParticipant.last_name);
  userEvent.type(screen.getByLabelText(/email/i), newParticipant.email);
  await fireEvent.change(screen.getByLabelText(/date of birth/i), {
    target: { value: '2005-05-12' }, // TODO make this generic
  });
  userEvent.type(screen.getByLabelText(/street/i), newParticipant.street);
  userEvent.type(screen.getByLabelText(/city/i), newParticipant.city);
  userEvent.type(screen.getByLabelText(/country/i), newParticipant.country);
  userEvent.selectOptions(
    screen.getByLabelText(/instrument/i),
    newParticipant.instrument.name
  );
  userEvent.type(screen.getByLabelText(/allergies/i), newParticipant.allergies);
  // userEvent.click(screen.getByLabelText(/terms of service/i));
  // screen.debug();

  userEvent.click(screen.getByText(/send my registration/i));

  // await waitForElementToBeRemoved(() =>
  //   screen.queryByText(/send my registration/i)
  // );
});
