import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@test/test-utils';
import Dashboard from './Dashboard';
import { useAuth0 } from '@auth0/auth0-react';
import ApiClient from '@app/services/ApiClient';

jest.mock('@auth0/auth0-react');
jest.mock('@app/services/ApiClient');

test('can render dashboard with no error', async () => {
  useAuth0.mockReturnValue({
    getAccessTokenSilently: jest.fn(() =>
      Promise.resolve({ token: 'a fake token' })
    ),
  });

  ApiClient.getInstruments.mockResolvedValue([]);
  ApiClient.getAllInscriptions.mockResolvedValue([]);

  render(<Dashboard />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
});
