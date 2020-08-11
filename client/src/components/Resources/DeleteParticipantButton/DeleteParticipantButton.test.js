import React from 'react';
import { render, screen } from '@testing-library/react';
import DeleteParticipantButton from './DeleteParticipantButton';
import userEvent from '@testing-library/user-event';

describe('DeletePartipantButton', () => {
  it('displays DeleteParticipantButton component', () => {
    render(<DeleteParticipantButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call promptPopup when clicked', async () => {
    const promptPopup = jest.fn();
    render(<DeleteParticipantButton promptPopup={promptPopup} />);

    const deleteButton = screen.getByRole('button');

    await userEvent.click(deleteButton);
    expect(promptPopup).toHaveBeenCalledTimes(1);
  });

  it('should call promptPopup with info, "delete"', async () => {
    const promptPopup = jest.fn();
    const info = {};
    render(<DeleteParticipantButton info={info} promptPopup={promptPopup} />);

    const deleteButton = screen.getByRole('button');

    await userEvent.click(deleteButton);
    expect(promptPopup).toHaveBeenCalledWith(info, 'Delete');
  });
});
