import React from 'react';
import {
  screen,
  wait,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import user from '@testing-library/user-event';
import { render, buildInstrument, buildParticipant } from '@test/test-utils';
import { server, rest } from './../../test/server/test-server';
import RegistrationPage from './Form';
import moment from 'moment';

const apiUrl = process.env.REACT_APP_API_URL;

const fakeInstruments = [buildInstrument(), buildInstrument()];

let registrationRequest;

beforeAll(() => {
  server.use(
    rest.get(`${apiUrl}/instruments`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(fakeInstruments));
    }),
    rest.post(`${apiUrl}/inscriptions`, (req, res, ctx) => {
      registrationRequest = req;
      return res(ctx.status(200), ctx.json({ message: 'ok' }));
    })
  );
});

test.skip('user can register', async () => {
  const newParticipant = buildParticipant({
    instrument: buildInstrument({ name: fakeInstruments[0].name }),
  });

  render(<RegistrationPage />);

  await waitForElementToBeRemoved(() => screen.queryByLabelText(/loading/i));

  await wait(() =>
    user.type(screen.getByLabelText(/^name/i), newParticipant.first_name)
  );
  await wait(() =>
    user.type(screen.getByLabelText(/surname/i), newParticipant.last_name)
  );
  await wait(() =>
    user.type(screen.getByLabelText(/email/i), newParticipant.email)
  );
  const dateOfBirthString = moment(newParticipant.date_of_birth).format(
    'YYYY-MM-DD'
  );
  await wait(() =>
    user.type(screen.getByLabelText(/date of birth/i), dateOfBirthString)
  );
  await wait(() =>
    user.type(screen.getByLabelText(/street/i), newParticipant.street)
  );
  await wait(() =>
    user.type(screen.getByLabelText(/city/i), newParticipant.city)
  );
  await wait(() =>
    user.type(screen.getByLabelText(/country/i), newParticipant.country)
  );
  await wait(() =>
    user.selectOptions(
      screen.getByLabelText(/instrument/i),
      newParticipant.instrument.id
    )
  );
  await wait(() =>
    user.type(screen.getByLabelText(/allergies/i), newParticipant.allergies)
  );
  await wait(() => user.click(screen.getByLabelText(/terms of service/i)));

  await wait(() => user.click(screen.getByText(/send my registration/i)));

  // This would be easier if all the variables used consistent casing
  // And if we had a Typescript DTO type, and the type we use in the front end
  // with a utility function to map between them. TODO, complete this with the
  // rest of the missing fields
  expect(registrationRequest.body).toMatchObject({
    first_name: newParticipant.first_name,
    last_name: newParticipant.last_name,
    email: newParticipant.email,
  });

  // TODO should also test that the form redirects to the confirmation page,
  // But for some reason, mocking redirect doesn't seem to be working
  await waitForElementToBeRemoved(() =>
    screen.getAllByRole('heading', /welcome/i)
  );
});
