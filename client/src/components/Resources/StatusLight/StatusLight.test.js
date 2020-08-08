import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusLight from './StatusLight';

describe('StatusLight', () => {
  it('displays status div status-light-container', () => {
    render(<StatusLight />);

    expect(screen.getByRole('status-light-container')).toBeInTheDocument();
  });

  it('has class "blue" when status is "New"', () => {
    render(<StatusLight status={'New'} />);

    expect(screen.getByRole('status-light')).toHaveClass('blue');
  });

  it('has class "orange" when status is "Paid"', () => {
    render(<StatusLight status={'Paid'} />);

    expect(screen.getByRole('status-light')).toHaveClass('orange');
  });

  it('has class "orange" when status is "downpayment"', () => {
    render(<StatusLight status={'downpayment'} />);

    expect(screen.getByRole('status-light')).toHaveClass('orange');
  });

  it('has class "dark-blue" when status is "Accepted"', () => {
    render(<StatusLight status={'Accepted'} />);

    expect(screen.getByRole('status-light')).toHaveClass('dark-blue');
  });

  it('has class "green" when status is "Complete"', () => {
    render(<StatusLight status={'Complete'} />);

    expect(screen.getByRole('status-light')).toHaveClass('green');
  });

  it('has class "green" when status is "payment complete"', () => {
    render(<StatusLight status={'payment complete'} />);

    expect(screen.getByRole('status-light')).toHaveClass('green');
  });

  it('has class "red" when status is "Cancelled"', () => {
    render(<StatusLight status={'Cancelled'} />);

    expect(screen.getByRole('status-light')).toHaveClass('red');
  });

  it('has class "red" when status is "pending"', () => {
    render(<StatusLight status={'pending'} />);

    expect(screen.getByRole('status-light')).toHaveClass('red');
  });

  it('has class "purple" when status is "Waitlist"', () => {
    render(<StatusLight status={'Waitlist'} />);

    expect(screen.getByRole('status-light')).toHaveClass('purple');
  });
});
