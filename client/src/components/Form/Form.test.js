import React from 'react';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { buildInstrument, buildParticipant } from '@test/test-utils';
import { server, rest } from './../../test/server/test-server';
import Form from './Form';

const apiUrl = process.env.REACT_APP_API_URL;

const fakeInstruments = [buildInstrument(), buildInstrument()];

test('user can register', async () => {
  server.use(
    rest.get(`${apiUrl}/instruments`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(fakeInstruments));
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
});

// import React from 'react';
// import { render, waitFor, fireEvent, act } from '@testing-library/react';
// import ApiClient from '../../services/ApiClient';
// import Form from './Form';
// import userEvent from '@testing-library/user-event';
// import '@testing-library/jest-dom/extend-expect';
// import '@testing-library/jest-dom'

// jest.mock('../../services/ApiClient');

// const fakeInstruments = [
//   { id: 'Guitar', name: "Guitar", max_attendants: 10 },
//   { id: 'Fiddle', name: "Fiddle", max_attendants: 10 },
//   { id: 'Cello', name: "Cello", max_attendants: 10 },
//   { id: 'Flute', name: "Flute", max_attendants: 10 },
// ];

// ApiClient.getInstruments.mockResolvedValue(fakeInstruments);

// const inputLabels = ['name', 'lastname', 'email', 'street', 'city', 'country', 'allergies'];

// const setup = () => {
//   jest.clearAllMocks();
//   const component = render(<Form />);
//   const inputs = {};
//   inputLabels.forEach(inputLabel => {
//     return inputs[inputLabel] = component.getByLabelText(inputLabel);
//   });
//   const select = component.getByLabelText('instrumentId');
//   const termsOfService = component.getByLabelText('acceptTos');
//   const birthdate = component.getByLabelText('birthdate');
//   const clearForm = component.getByLabelText('clearForm');
//   const submit = component.getByLabelText('submit');
//   return {
//     ...inputs,
//     component,
//     select,
//     birthdate,
//     termsOfService,
//     clearForm,
//     submit,
//   }
// }

// describe('Form', () => {
//   inputLabels.forEach(inputLabel => {
//     test(`user can enter text in ${inputLabel}`, () => {
//       const input = setup()[inputLabel];
//       expect(input).toBeInTheDocument();
//       expect(input).toHaveValue('');
//       if (input.name !== 'allergies') expect(input.required).toBe(true);
//       fireEvent.change(input, { target: { value: 'Banana pizza 🍕' } });
//       expect(input).toHaveValue('Banana pizza 🍕');
//     });
//   });

//   test('user can select an instrument from the list', async () => {
//     const { select } = setup();
//     expect(select).toBeInTheDocument();
//     expect(select.required).toBe(true);
//     expect(ApiClient.getInstruments).toHaveBeenCalledTimes(1);

//     // TODO: finish test.
//     // Issue: the test is done with the initial state of instruments (an empty array), so needs to wait until it loads all intruments to do the testing
//     // await waitFor(() => expect(screen.getByText("Loading...")).toBeInTheDocument());
//     // expect(await screen.findByText("Loading...")).not.toBeInTheDocument();

//     // fireEvent.change(select, { target: { value: 'Guitar' } }) //The value should be the key of the option
//     // expect(options[0].selected).toBe(false);
//     // expect(options[1].selected).toBe(false);
//     // expect(options[2].selected).toBe(false);
//     // expect(options[3].selected).toBe(false);
//   });

//   test('user can pick his birthdate', () => {
//     const { birthdate } = setup();
//     expect(birthdate).toBeInTheDocument();
//     expect(birthdate.required).toBe(true);
//     expect(birthdate).toHaveValue('');
//     fireEvent.change(birthdate, { target: { value: '1990-05-25' } });
//     expect(birthdate).toHaveValue('1990-05-25');
//   });

//   test('user can accept terms of service', () => {
//     const { termsOfService } = setup();
//     expect(termsOfService).toBeInTheDocument();
//     expect(termsOfService.required).toBe(true);
//     expect(termsOfService.checked).toBe(false);
//     fireEvent.change(termsOfService, { target: { checked: true } });
//     expect(termsOfService.checked).toBe(true);
//   });

//   test('user can clear the form', async () => {
//     const { clearForm, name } = setup();
//     expect(clearForm).toBeInTheDocument();
//     fireEvent.change(name, { target: { value: 'Banana pizza 🍕' } });
//     // TODO: assign value to inputs and then check if its value is ''
//     // expect(name).toHaveValue('Banana pizza 🍕');
//     // await userEvent.click(clearForm);   // throwing error ->  Invariant failed: You should not use <Redirect> outside a <Router>
//     // expect(name).toHaveValue('');
//   });

//   test('user can send send his registration', () => {
//     const { submit, name, lastname, email, birthdate, street, city, country, allergies, acceptsTos } = setup();
//     expect(submit).toBeInTheDocument();
//     // TODO: assign value to inputs and then check if its value is ''
//     // await userEvent.click(submit);   // throwing error ->  Invariant failed: You should not use <Redirect> outside a <Router>
//     // expect(ApiClient.postNewAttendant).toHaveBeenCalledTimes(1);
//     // expect(ApiClient.postNewAttendant).toBeCalledWith({
//     //   name: name.value,
//     //   lastname: lastname.value,
//     //   email: email.value,
//     //   birthdate: birthdate.value,
//     //   street: street.value,
//     //   city: city.value,
//     //   country: country.value,
//     //   allergies: allergies.value,
//     //   acceptsTos: acceptsTos.value,
//     // });
//   })
// });
