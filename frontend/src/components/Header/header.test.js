import React from 'react';
import { renderWithClient } from 'test-utils';
import { screen } from '@testing-library/react';
import Header from './index';
import { QueryClient } from 'react-query';

jest.mock('./Submenu', () => () => <div>Submenu</div>);

describe('Header', () => {
  const queryClient = new QueryClient();

  it('renders correctly', () => {
    renderWithClient(queryClient, <Header />);

    // screen.debug();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: 'sign in' })).toHaveAttribute(
      'href',
      '/login'
    );
    expect(screen.getByRole('link', { name: 'cart' })).toHaveAttribute(
      'href',
      '/cart'
    );
  });
});
