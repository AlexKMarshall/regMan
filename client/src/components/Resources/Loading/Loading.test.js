import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading', () => {
  it('displays img span when loading', () => {
    render(<Loading />);
    expect(screen.getAllByRole('loader-container')).toHaveLength(1);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
