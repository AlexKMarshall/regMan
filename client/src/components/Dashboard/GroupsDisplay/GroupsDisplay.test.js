import React from 'react';
import { render, buildParticipant, buildInstrument } from '@test/test-utils';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import GroupsDisplay from './GroupsDisplay';

jest.mock('react-chartjs-2');

describe('GroupsDisplay', () => {
  test('it should render the component', () => {
    Doughnut.mockReturnValue('Graph');
    Bar.mockReturnValue('Graph');
    Line.mockReturnValue('Graph');

    const instruments = [
      buildInstrument({ name: 'Fiddle' }),
      buildInstrument({ name: 'Cello' }),
    ];
    const participants = [
      buildParticipant({ instrument: instruments[0] }),
      buildParticipant({ instrument: instruments[0] }),
    ];

    render(
      <GroupsDisplay participants={participants} instruments={instruments} />
    );
  });
});
