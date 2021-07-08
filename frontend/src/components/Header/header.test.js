import React from 'react';
import { renderWithRouter } from 'test-utils';
import { screen } from '@testing-library/react';
import Header from './index';

jest.mock('./Submenu', () => () => <div>Submenu</div>);

describe('Header', () => {
  it('renders correctly', () => {
    renderWithRouter(<Header />);

    // screen.debug();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();

    expect(screen.getByText(/sign in/i)).toHaveAttribute('href', '/login');
    expect(screen.getByText(/cart/i)).toHaveAttribute('href', '/cart');
  });
});
