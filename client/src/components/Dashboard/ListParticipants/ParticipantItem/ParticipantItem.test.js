import React from 'react';
import { render, screen } from '@testing-library/react';
import { ParticipantItem } from '@app/components';
import { MemoryRouter } from 'react-router-dom';
import faker from 'faker';

function buildParticipant(options) {
  return {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    id: faker.random.uuid(),
    instrument: {
      name: faker.commerce.product(),
    },
    is_underage: faker.random.boolean(),
    ...options,
  };
}

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
    const fakeUnderageParticipant = buildParticipant({ is_underage: true });
    renderWithRouter(<ParticipantItem participant={fakeUnderageParticipant} />);

    expect(screen.getByLabelText('underage')).toBeInTheDocument();
    expect(screen.queryByLabelText('adult')).not.toBeInTheDocument();
  });

  test('it displays an icon for an adult participant', () => {
    const fakeAdultParticipant = buildParticipant({ is_underage: false });
    renderWithRouter(<ParticipantItem participant={fakeAdultParticipant} />);

    expect(screen.getByLabelText('adult')).toBeInTheDocument();
    expect(screen.queryByLabelText('underage')).not.toBeInTheDocument();
  });
});
