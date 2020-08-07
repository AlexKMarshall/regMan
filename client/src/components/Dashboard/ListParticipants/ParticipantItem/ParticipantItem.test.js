import React from 'react';
import { render, screen } from '@testing-library/react';
import { ParticipantItem } from '@app/components';
import { MemoryRouter } from 'react-router-dom';

const fakeParticipant = {
  first_name: 'Jarvis',
  last_name: 'Cocker',
  email: 'jarvis@pulp.mus',
  id: 123,
  instrument: { name: 'accordian' },
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

    const participantEmailLink = screen.getByRole('link', {
      name: fakeParticipant.email,
    });
    expect(participantEmailLink).toHaveAttribute(
      'href',
      `mailto:${fakeParticipant.email}`
    );

    expect(
      screen.getByText(fakeParticipant.instrument.name)
    ).toBeInTheDocument();
  });
});
