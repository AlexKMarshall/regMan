import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditButtons from './EditButtons';

describe('EditButtons', () => {
  const clickFunctions = {};

  it('should only display save and cancel buttons', () => {
    render(
      <EditButtons buttonFunctionality={clickFunctions} isEditting={true} />
    );

    expect(
      screen.getByRole('button', { name: 'Save changes' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Cancel changes' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Edit contact' })
    ).not.toBeInTheDocument();
  });

  it('should only display the edit button', () => {
    render(
      <EditButtons buttonFunctionality={clickFunctions} isEditting={false} />
    );

    expect(
      screen.queryByRole('button', { name: 'Save changes' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Cancel changes' })
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Edit contact' })
    ).toBeInTheDocument();
  });

  const buttons = [
    {
      name: 'Save changes',
      isEditting: true,
      fnTimes: { submit: 1, edit: 0, cancel: 0 },
    },
    {
      name: 'Edit contact',
      isEditting: false,
      fnTimes: { submit: 0, edit: 1, cancel: 0 },
    },
    {
      name: 'Cancel changes',
      isEditting: true,
      fnTimes: { submit: 0, edit: 0, cancel: 1 },
    },
  ];

  buttons.forEach((button) => {
    it(`click on ${button.name} should only call the respective Fn `, () => {
      clickFunctions.editParticipant = jest.fn();
      clickFunctions.cancelChanges = jest.fn();
      clickFunctions.submitChanges = jest.fn();
      render(
        <EditButtons
          buttonFunctionality={clickFunctions}
          isEditting={button.isEditting}
        />
      );
      userEvent.click(screen.getByRole('button', { name: button.name }));

      expect(clickFunctions.submitChanges).toHaveBeenCalledTimes(
        button.fnTimes.submit
      );
      expect(clickFunctions.editParticipant).toHaveBeenCalledTimes(
        button.fnTimes.edit
      );
      expect(clickFunctions.cancelChanges).toHaveBeenCalledTimes(
        button.fnTimes.cancel
      );
    });
  });
});
