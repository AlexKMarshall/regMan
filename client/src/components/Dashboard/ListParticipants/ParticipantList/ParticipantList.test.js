import React from 'react';
import { buildParticipant, render, screen } from '@test/test-utils';
import userEvent from '@testing-library/user-event';
import ParticipantList from './ParticipantList';
import { getAllByRole } from '@testing-library/react';

function buildParticipants({ maxNumber = 10, number } = {}) {
  const numberOfParticipants = number ?? Math.ceil(Math.random() * maxNumber);

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
    const emptyParticipants = buildParticipants({ maxNumber: 0 });
    render(<ParticipantList participants={emptyParticipants} />);
    expect(screen.getByText(/no one has registered yet/i)).toBeInTheDocument();
  });

  test('searching should filter on name', async () => {
    const participants = buildParticipants({
      number: 2,
    });
    render(<ParticipantList participants={participants} />);
    const [firstParticipant, secondParticpant] = participants;
    const name1Regex = new RegExp(firstParticipant.first_name, 'g');
    const name2Regex = new RegExp(secondParticpant.first_name, 'g');

    const initialRows = screen.getAllByRole('row');
    expect(initialRows).toHaveLength(2);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, firstParticipant.first_name);

    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(screen.getByRole('cell', { name: name1Regex })).toBeInTheDocument();
    expect(
      screen.queryByRole('cell', { name: name2Regex })
    ).not.toBeInTheDocument();
  });
});
