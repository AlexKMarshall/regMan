import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from './Button';

describe('Button', () => {
  const onClickMock = jest.fn();
  const nameMock = 'This is a button';

  it('should Display a button with the provided props', () => {
    render(<Button name={nameMock} onClick={onClickMock} />);

    expect(screen.getByRole('button', { name: nameMock })).toBeInTheDocument();
  });

  it('should call the provided onClickHandler when clicked', () => {
    render(<Button name={nameMock} onClick={onClickMock} />);
    userEvent.click(screen.getByRole('button', { name: nameMock }));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
