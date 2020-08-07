import React from 'react';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';

import EditButtons from './EditButtons';

import fs from 'fs';
import path from 'path';

const cssFile = fs.readFileSync(
  path.resolve(__dirname, './EditButtons.css'),
  'utf8'
);

describe('EditButtons', () => {
  const clickFunctions = {};
  clickFunctions.editParticipant = jest.fn();
  clickFunctions.cancelChanges = jest.fn();
  clickFunctions.submitChanges = jest.fn();

  it('should only display save and cancel buttons', () => {
    const { container, getByRole, queryByRole } = render(
      <EditButtons buttonFunctionality={clickFunctions} isEditting={true} />
    );
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssFile;
    container.append(style);

    expect(getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Cancel changes' })).toBeInTheDocument();

    expect(
      queryByRole('button', { name: 'Edit contact' })
    ).not.toBeInTheDocument();
    cleanup();
  });

  it('should only display the edit button', () => {
    const { container, getByRole, queryByRole } = render(
      <EditButtons buttonFunctionality={clickFunctions} isEditting={false} />
    );

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssFile;
    container.append(style);

    expect(
      queryByRole('button', { name: 'Save changes' })
    ).not.toBeInTheDocument();
    expect(
      queryByRole('button', { name: 'Cancel changes' })
    ).not.toBeInTheDocument();

    expect(getByRole('button', { name: 'Edit contact' })).toBeInTheDocument();
    cleanup();
  });

  it('save button should call only the submitChanges Fn when clicked', () => {
    render(
      <EditButtons buttonFunctionality={clickFunctions} isEditting={true} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(clickFunctions.submitChanges).toHaveBeenCalledTimes(1);
    expect(clickFunctions.editParticipant).toHaveBeenCalledTimes(0);
    expect(clickFunctions.cancelChanges).toHaveBeenCalledTimes(0);
    cleanup();
  });
});
