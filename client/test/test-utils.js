import React from 'react';
import faker from 'faker';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

function render(ui, ...rest) {
  return rtlRender(<MemoryRouter>{ui}</MemoryRouter>, ...rest);
}

export function buildInstrument(overrides) {
  return {
    id: faker.random.uuid(),
    name: faker.commerce.productName(),
    max_attendants: Math.ceil(Math.random() * 10),
    ...overrides,
  };
}

export function buildParticipant(options) {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    id: faker.random.uuid(),
    instrument: {
      name: faker.commerce.product(),
    },
    is_underage: faker.random.boolean(),
    registration_status: 'New',
    ...options,
  };
}

export function buildParticipants({
  maxNumber = 10,
  number,
  participantBuilder = buildParticipant,
} = {}) {
  const numberOfParticipants = number ?? Math.ceil(Math.random() * maxNumber);

  let participants = [];
  for (let i = 0; i < numberOfParticipants; i++) {
    participants.push(participantBuilder());
  }
  return participants;
}

export function buildPayment(options) {
  return {
    id: options.index,
    type_of_payment: 'Payment',
    amount_paid: faker.random.number(options.amount_paid) * 100,
    payment_date: faker.date.past(),
  };
}

export function buildPayments({
  maxNumber = 3,
  number,
  paymentBuilder = buildPayment,
} = {}) {
  const numberOfPayments = number ?? Math.ceil(Math.random() * maxNumber);

  let payments = [];
  for (let i = 0; i < numberOfPayments; i++) {
    payments.push(
      paymentBuilder({
        index: i,
        amount_paid: {
          min: 50,
          max: 200,
          precision: 1,
        },
      })
    );
  }
  return payments;
}
export * from '@testing-library/react';
export { render };
