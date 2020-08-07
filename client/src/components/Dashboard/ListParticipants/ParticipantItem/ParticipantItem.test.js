import React from 'react';
import { render, screen } from '@testing-library/react';
import { ParticipantItem } from '@app/components';
import { MemoryRouter } from 'react-router-dom';

const fakeParticipant = {
  first_name: 'Jarvis',
  last_name: 'Cocker',
  id: 123,
  instrument: {},
};

describe('ParticipantItem', () => {
  test('it renders a participant', () => {
    render(
      <MemoryRouter>
        <ParticipantItem participant={fakeParticipant} />
      </MemoryRouter>
    );

    const participantDetailLink = screen.getByRole('link', {
      name: `${fakeParticipant.last_name} , ${fakeParticipant.first_name}`,
    });

    expect(participantDetailLink).toBeInTheDocument();
    expect(participantDetailLink).toHaveAttribute(
      'href',
      `/dashboard/details/${fakeParticipant.id}/personal`
    );
  });
});
