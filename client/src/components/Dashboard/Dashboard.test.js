import React from 'react';
import { render, screen, waitForElementToBeRemoved } from '@test/test-utils';
import Dashboard from './Dashboard';
import { useAuth0 } from '@auth0/auth0-react';
import ApiClient from '@app/services/ApiClient';

jest.mock('@auth0/auth0-react');
jest.mock('@app/services/ApiClient');

test('dashboard renders without error', async () => {
  const token = 'FAKE_TOKEN';
  useAuth0.mockReturnValue({
    getAccessTokenSilently: jest.fn(() => Promise.resolve(token)),
  });

  render(<Dashboard />);
});
