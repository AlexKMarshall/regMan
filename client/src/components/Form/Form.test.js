import React from 'react';
import { render, screen, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { buildInstrument, buildParticipant } from '@test/test-utils';
import { server, rest } from './../../test/server/test-server';
import RegistrationForm from './Form-new';
import { Redirect as MockRedirect } from 'react-router';

jest.mock('react-router', () => {
  return {
    Redirect: jest.fn(() => null),
  };
});

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

test('user can register', async () => {
  const newParticipant = buildParticipant({
    instrument: buildInstrument({ name: fakeInstruments[0].name }),
  });

  render(<RegistrationForm />);

  // await waitForElementToBeRemoved(() => screen.queryByLabelText(/loading/i));

  userEvent.type(screen.getByLabelText(/^name/i), newParticipant.first_name);
  await wait(() =>
    expect(screen.getByLabelText(/^name/i)).toHaveValue(
      newParticipant.first_name
    )
  );
  userEvent.type(screen.getByLabelText(/surname/i), newParticipant.last_name);
  await wait(() =>
    expect(screen.getByLabelText(/surname/i)).toHaveValue(
      newParticipant.last_name
    )
  );
  userEvent.type(screen.getByLabelText(/email/i), newParticipant.email);
  await wait(() =>
    expect(screen.getByLabelText(/email/i)).toHaveValue(newParticipant.email)
  );

  userEvent.click(screen.getByText(/send my registration/i));

  await wait(() => expect(MockRedirect).toHaveBeenCalledTimes(1));
  expect(MockRedirect).toHaveBeenCalledWith({ to: '/confirmation' }, {});

  // userEvent.type(screen.getByLabelText(/email/i), newParticipant.email);
  // await fireEvent.change(screen.getByLabelText(/date of birth/i), {
  //   target: { value: '2005-05-12' }, // TODO make this generic
  // });
  // userEvent.type(screen.getByLabelText(/street/i), newParticipant.street);
  // userEvent.type(screen.getByLabelText(/city/i), newParticipant.city);
  // userEvent.type(screen.getByLabelText(/country/i), newParticipant.country);
  // userEvent.selectOptions(
  //   screen.getByLabelText(/instrument/i),
  //   newParticipant.instrument.name
  // );
  // userEvent.type(screen.getByLabelText(/allergies/i), newParticipant.allergies);
  // // userEvent.click(screen.getByLabelText(/terms of service/i));
  // // screen.debug();

  // userEvent.click(screen.getByText(/send my registration/i));

  // // await waitForElementToBeRemoved(() =>
  // //   screen.queryByText(/send my registration/i)
  // // );
});

xtest('user can register', async () => {
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

  render(<RegistrationForm />);

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
