import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

jest.mock('@auth0/auth0-react');

describe('Navbar', () => {
  test('it should show Admin Access button for logged-out user', () => {
    useAuth0.mockReturnValue({ isAuthenticated: false });
    render(<Navbar />);
    expect(
      screen.getByRole('button', {
        name: 'Admin Access',
      })
    ).toBeInTheDocument();
  });

  test('it should not show admin-only links for logged-out user', () => {
    useAuth0.mockReturnValue({ isAuthenticated: false });
    render(<Navbar />);

    expect(
      screen.queryByRole('link', { name: 'Dashboard' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Groups' })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Logout' })
    ).not.toBeInTheDocument();
  });

  test('it should call the authentication service when clicking Admin Access button', async () => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: jest.fn(),
    });
    render(<Navbar />);

    const { loginWithRedirect } = useAuth0();

    const loginButton = screen.getByRole('button', {
      name: 'Admin Access',
    });

    await userEvent.click(loginButton);
    expect(loginWithRedirect).toHaveBeenCalledTimes(1);
  });

  test('it should render admin-only links for logged-in user', () => {
    useAuth0.mockReturnValue({ isAuthenticated: true });
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Groups' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log Out' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Admin Access' })
    ).not.toBeInTheDocument();
  });
});
