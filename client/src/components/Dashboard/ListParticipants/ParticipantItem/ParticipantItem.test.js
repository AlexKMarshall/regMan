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

const fakeUnderageParticipant = {
  first_name: 'A',
  last_name: 'Child',
  email: 'child@disney.com',
  id: 234,
  instrument: { name: 'sousaphone' },
  is_underage: true,
};

const fakeAdultParticipant = {
  first_name: 'An',
  last_name: 'Adult',
  email: 'adult@importantjob.com',
  id: 567,
  instrument: { name: 'penny whistle' },
  is_underage: false,
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

  test('it displays an icon for an underage participant', () => {
    render(
      <MemoryRouter>
        <ParticipantItem participant={fakeUnderageParticipant} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('underage')).toBeInTheDocument();
    expect(screen.queryByLabelText('adult')).not.toBeInTheDocument();
  });

  test('it displays an icon for an adult participant', () => {
    render(
      <MemoryRouter>
        <ParticipantItem participant={fakeAdultParticipant} />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('adult')).toBeInTheDocument();
    expect(screen.queryByLabelText('underage')).not.toBeInTheDocument();
  });
});
