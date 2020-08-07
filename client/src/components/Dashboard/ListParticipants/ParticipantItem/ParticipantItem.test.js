import React from 'react';
import { render, screen } from '@testing-library/react';
import { ParticipantItem } from '@app/components';
import { MemoryRouter } from 'react-router-dom';
import faker from 'faker';

function buildParticipant() {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    id: faker.random.uuid(),
    instrument: {
      name: faker.commerce.product(),
    },
  };
}

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

function renderWithRouter(ui, options) {
  return render(<MemoryRouter>{ui}</MemoryRouter>, options);
}

describe('ParticipantItem', () => {
  test('it renders a participant', () => {
    const fakeParticipant = buildParticipant();
    renderWithRouter(<ParticipantItem participant={fakeParticipant} />);

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
    renderWithRouter(<ParticipantItem participant={fakeUnderageParticipant} />);

    expect(screen.getByLabelText('underage')).toBeInTheDocument();
    expect(screen.queryByLabelText('adult')).not.toBeInTheDocument();
  });

  test('it displays an icon for an adult participant', () => {
    renderWithRouter(<ParticipantItem participant={fakeAdultParticipant} />);

    expect(screen.getByLabelText('adult')).toBeInTheDocument();
    expect(screen.queryByLabelText('underage')).not.toBeInTheDocument();
  });
});
