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

  test('searching should filter on name and be clearable', async () => {
    const participants = buildParticipants({
      number: 2,
    });
    render(<ParticipantList participants={participants} />);
    const [firstParticipant, secondParticipant] = participants;
    const name1Regex = new RegExp(firstParticipant.first_name, 'g');
    const name2Regex = new RegExp(secondParticipant.first_name, 'g');

    const initialRows = screen.getAllByRole('row');
    expect(initialRows).toHaveLength(2);

    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, firstParticipant.first_name);

    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(
      screen.getByRole('cell', {
        name: name1Regex,
      })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('cell', { name: name2Regex })
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByLabelText(/cancel search/i));

    expect(screen.getAllByRole('row')).toHaveLength(2);

    // Having to use different queries here because the getByRole('cell') ones
    // aren't finding the names. I'm guessing this might be to do with
    // the component not re-rendering correctly, but for now these seem to work
    const results = screen.getAllByRole('cell');
    expect(results[0]).toHaveTextContent(firstParticipant.first_name);
    expect(results[1]).toHaveTextContent(secondParticipant.first_name);
  });

  test('it should be possible to filter out participants that have cancelled', async () => {
    const activeParticipant = buildParticipant({ registration_status: 'New' });
    const cancelledParticipant = buildParticipant({
      registration_status: 'Cancelled',
    });
    const participants = [activeParticipant, cancelledParticipant];
    const activeNameRegExp = new RegExp(activeParticipant.first_name, 'gi');
    const cancelledNameRegExp = new RegExp(
      cancelledParticipant.first_name,
      'gi'
    );

    render(<ParticipantList participants={participants} />);

    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.getByText(activeNameRegExp)).toBeInTheDocument();
    expect(screen.getByText(cancelledNameRegExp)).toBeInTheDocument();

    await userEvent.click(
      screen.getByLabelText(/filter cancelled registrations/i)
    );

    expect(screen.getAllByRole('row')).toHaveLength(1);
    expect(screen.getByText(activeNameRegExp)).toBeInTheDocument();
    expect(screen.queryByText(cancelledNameRegExp)).not.toBeInTheDocument();
  });

  test('should display "no matching records" if search result is empty', async () => {
    const participants = buildParticipants();

    render(<ParticipantList participants={participants} />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    await userEvent.type(searchInput, 'something that will not be found');
    expect(screen.getByText(/no matching records/i)).toBeInTheDocument();
  });
});
