import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import moment from 'moment';
import HealthDetails from './HealthDetails';

describe('PaymentItem', () => {
  const isEditting = false;
  const details = {
    allergies: 'pollen',
  };
  const handleChange = jest.fn();
  const setDisplayEdit = jest.fn();

  it('should render an input field with allergies', () => {
    render(
      <HealthDetails
        details={details}
        isEditting={isEditting}
        handleChange={handleChange}
        setDisplayEdit={setDisplayEdit}
      />
    );

    expect(
      screen.getByRole('textbox', { value: details.allergies })
    ).toBeInTheDocument();
  });

  it('should set the input to readonly when !isEditting', () => {
    render(
      <HealthDetails
        details={details}
        isEditting={isEditting}
        handleChange={handleChange}
        setDisplayEdit={setDisplayEdit}
      />
    );

    expect(
      screen.getByRole('textbox', { readOnly: !isEditting })
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { readOnly: !isEditting })).toHaveClass(
      'disabled'
    );
  });
});
