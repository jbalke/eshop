import { screen } from '@testing-library/react';
import * as React from 'react';
import { QueryClient } from 'react-query';
import { renderWithClient } from 'test-utils';
import App from './App';

jest.mock('./pages/Home', () => () => <div>Home</div>);
jest.mock('./pages/Cart', () => () => <div>Cart</div>);
jest.mock('./pages/Product', () => () => <div>Product</div>);
jest.mock('./pages/Login', () => () => <div>Login</div>);
jest.mock('./pages/Register', () => () => <div>Register</div>);
jest.mock('./pages/Logout', () => () => <div>Logout</div>);

describe('App', () => {
  const client = new QueryClient();

  it('renders successfully', () => {
    renderWithClient(client, <App />);

    expect(screen.getByRole('banner')).toHaveTextContent(/e-shop/i);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

describe('routing unauthenticated', () => {
  const client = new QueryClient();

  it('renders Home component on root route', () => {
    renderWithClient(client, <App />, { route: '/' });
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
  it('renders Register component on /register route', () => {
    renderWithClient(client, <App />, { route: '/register' });
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
  it('renders Login component on /login route', () => {
    renderWithClient(client, <App />, { route: '/login' });
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
  it('renders Cart component on /cart route', () => {
    renderWithClient(client, <App />, { route: '/cart' });
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });
  it('redirects to login on private route', () => {
    const { history } = renderWithClient(client, <App />, { route: '/me' });
    expect(history.location.pathname).toBe('/login');
  });
  it('redirects to login on admin route', () => {
    const { history } = renderWithClient(client, <App />, {
      route: '/admin/user-list',
    });

    expect(history.location.pathname).toBe('/login');
  });
  it("returns '404 Not Found' on bad route", () => {
    renderWithClient(client, <App />, { route: '/nonexisting-route' });
    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });

  it('"sign in" link goes to /login', async () => {
    renderWithClient(client, <App />);
    expect(screen.getByRole('link', { name: 'sign in' })).toHaveAttribute(
      'href',
      '/login'
    );
  });
});
