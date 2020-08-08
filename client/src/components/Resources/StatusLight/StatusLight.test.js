import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusLight from './StatusLight';

describe('StatusLight', () => {
  it('displays status div status-light-container', () => {
    render(<StatusLight />);
    expect(screen.getByRole('status-light-container')).toBeInTheDocument();
  });
});
