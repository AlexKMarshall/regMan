import React from 'react';
import { buildParticipant, render, screen } from '@test/test-utils';
import ParticipantList from './ParticipantList';

function buildParticipants() {
  const numberOfParticipants = Math.ceil(Math.random() * 10);

  let participants = [];
  for (let i = 0; i < numberOfParticipants; i++) {
    participants.push(buildParticipant());
  }
  return participants;
}

describe('ParticipantList', () => {
  test('it should render a list of participants', () => {
    const participants = buildParticipants();

    render(<ParticipantList participants={participants} />);

    participants.forEach(({ first_name }) => {
      const nameRegex = new RegExp(first_name, 'g');
      expect(screen.getAllByText(nameRegex)[0]).toBeInTheDocument();
    });
  });

  test('it should display message when there are no participants', () => {
    const emptyParticipants = [];
    render(<ParticipantList participants={emptyParticipants} />);
    expect(screen.getByText(/no one has registered yet/i)).toBeInTheDocument();
  });
});
