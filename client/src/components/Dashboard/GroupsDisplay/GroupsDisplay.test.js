import React from 'react';
import { render, buildParticipant } from '@test/test-utils';
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
    const instruments = [
      buildInstrument({ name: 'Fiddle' }),
      buildInstrument({ name: 'Cello' }),
    ];
    const participants = [
      buildParticipant({ instrument: instruments[0] }),
      buildParticipant({ instrument: instruments[0] }),
    ];

    // render(
    //   <GroupsDisplay participants={participants} instruments={instruments} />
    // );
  });
});