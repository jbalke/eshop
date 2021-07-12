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

  it('renders successfully', async () => {
    await renderWithClient(client, <App />);

    expect(screen.getByRole('banner')).toHaveTextContent(/e-shop/i);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

describe('routing unauthenticated', () => {
  const client = new QueryClient();

  it('renders Home component on root route', async () => {
    renderWithClient(client, <App />, { route: '/' });
    const elm = await screen.findByText('Home');
    expect(elm).toBeInTheDocument();
  });
  it('renders Register component on /register route', async () => {
    renderWithClient(client, <App />, { route: '/register' });
    const elm = await screen.findByText('Register');
    expect(elm).toBeInTheDocument();
  });
  it('renders Login component on /login route', async () => {
    renderWithClient(client, <App />, { route: '/login' });
    const elm = await screen.findByText('Login');
    expect(elm).toBeInTheDocument();
  });
  it('renders Cart component on /cart route', async () => {
    renderWithClient(client, <App />, { route: '/cart' });
    const elm = await screen.findByText('Cart');
    expect(elm).toBeInTheDocument();
  });
  it('redirects to login on private route', async () => {
    const { history } = renderWithClient(client, <App />, { route: '/me' });
    expect(history.location.pathname).toBe('/login');
  });
  it('redirects to login on admin route', () => {
    const { history } = renderWithClient(client, <App />, {
      route: '/admin/user-list',
    });

    expect(history.location.pathname).toBe('/login');
  });
  it("returns '404 Not Found' on bad route", async () => {
    renderWithClient(client, <App />, { route: '/nonexisting-route' });
    const elm = await screen.findByText(/404 Not Found/i);
    expect(elm).toBeInTheDocument();
  });

  it('"sign in" link goes to /login', async () => {
    renderWithClient(client, <App />);
    const elm = await screen.findByRole('link', { name: 'sign in' });
    expect(elm).toHaveAttribute('href', '/login');
  });
});
