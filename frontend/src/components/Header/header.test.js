import React from 'react';
import { renderWithRouter } from 'test-utils';
import Header from './index';

jest.mock('./Submenu', () => () => <div>Submenu</div>);

describe('Header', () => {
  it('renders correctly', () => {
    const { container, getByText } = renderWithRouter(<Header />);

    expect(container.innerHTML).toMatch(/e-shop/i);

    expect(getByText(/sign in/i)).toHaveAttribute('href', '/login');
    expect(getByText(/cart/i)).toHaveAttribute('href', '/cart');
  });
});
