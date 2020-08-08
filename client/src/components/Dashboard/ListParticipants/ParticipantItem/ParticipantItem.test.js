import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import { ParticipantItem } from '@app/components';
import { buildParticipant, render } from '@test/test-utils';

describe('ParticipantItem', () => {
  test('it renders a participant', () => {
    const fakeParticipant = buildParticipant();
    render(<ParticipantItem participant={fakeParticipant} />);

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
    render(<ParticipantItem participant={fakeUnderageParticipant} />);

    expect(screen.getByLabelText('underage')).toBeInTheDocument();
    expect(screen.queryByLabelText('adult')).not.toBeInTheDocument();
  });

  test('it displays an icon for an adult participant', () => {
    const fakeAdultParticipant = buildParticipant({ is_underage: false });
    render(<ParticipantItem participant={fakeAdultParticipant} />);

    expect(screen.getByLabelText('adult')).toBeInTheDocument();
    expect(screen.queryByLabelText('underage')).not.toBeInTheDocument();
  });
});
