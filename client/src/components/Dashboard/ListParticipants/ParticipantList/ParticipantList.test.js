import React from 'react';
import { buildParticipant, render, screen } from '@test/test-utils';
import ParticipantList from './ParticipantList';
import { getByText } from '@testing-library/react';

describe('ParticipantList', () => {
  test('it should render a list of participants', () => {
    const numberOfParticipants = 5;

    let participants = [];
    for (let i = 0; i < numberOfParticipants; i++) {
      participants.push(buildParticipant());
    }

    render(<ParticipantList participants={participants} />);

    participants.forEach(({ first_name }) => {
      const nameRegex = new RegExp(first_name, 'g');
      expect(screen.getByText(nameRegex)).toBeInTheDocument();
    });
  });
});
