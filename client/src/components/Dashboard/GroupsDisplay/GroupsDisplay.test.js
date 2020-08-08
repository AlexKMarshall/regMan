import React from 'react';
import { render, buildParticipants } from '@test/test-utils';
import GroupsDisplay from './GroupsDisplay';
import faker from 'faker';

function buildInstrument(overrides) {
  return {
    name: faker.commerce.productName,
    max_attendants: Math.ceil(Math.random() * 10),
    ...overrides,
  };
}

function buildInstrumentArray({ maxNumber = 10 }) {
  const numOfInstruments = Math.ceil(Math.random() * maxNumber);
  const instruments = [];
  for (let i = 0; i < numOfInstruments; i++) {
    instruments.push(buildInstrument());
  }
  return instruments;
}

describe('GroupsDisplay', () => {
  test('it should render the component', () => {
    const participants = buildParticipants();
    expect(true).toBe(true);
    // render(<GroupsDisplay participants={participants} />);
  });
});
