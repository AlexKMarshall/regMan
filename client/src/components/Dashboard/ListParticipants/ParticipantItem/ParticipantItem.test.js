import React from 'react';
import { render, screen } from '@testing-library/react';
import { ParticipantItem } from '@app/components';
import { MemoryRouter } from 'react-router-dom';

const fakeParticipant = {
  first_name: 'Jarvis',
  last_name: 'Cocker',
  instrument: {},
};

describe('ParticipantItem', () => {
  test('it renders a participant with their name', () => {
    render(
      <MemoryRouter>
        <ParticipantItem participant={fakeParticipant} />
      </MemoryRouter>
    );
    expect(
      screen.getByText(
        `${fakeParticipant.last_name}, ${fakeParticipant.first_name}`
      )
    ).toBeInTheDocument();
  });
});
