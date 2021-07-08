import { screen } from '@testing-library/react';
import { renderWithRouter } from '../test-utils';
import App from './App';

jest.mock('./pages/Home', () => () => <div>Home</div>);
jest.mock('./pages/Cart', () => () => <div>Cart</div>);
jest.mock('./pages/Product', () => () => <div>Product</div>);
jest.mock('./pages/Login', () => () => <div>Login</div>);
jest.mock('./pages/Register', () => () => <div>Register</div>);
jest.mock('./pages/Logout', () => () => <div>Logout</div>);

describe('App', () => {
  it('renders successfully', () => {
    renderWithRouter(<App />);

    expect(screen.getByRole('banner')).toHaveTextContent(/e-shop/i);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

describe('routing unauthenticated', () => {
  it('renders Home component on root route', () => {
    renderWithRouter(<App />, { route: '/' });
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
  it('renders Register component on /register route', () => {
    renderWithRouter(<App />, { route: '/register' });
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
  it('renders Login component on /login route', () => {
    renderWithRouter(<App />, { route: '/login' });
    expect(screen.getByText('Login')).toBeInTheDocument();
  });
  it('renders Cart component on /cart route', () => {
    renderWithRouter(<App />, { route: '/cart' });
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });
  it('redirects to login on private route', () => {
    const { history } = renderWithRouter(<App />, { route: '/me' });
    expect(history.location.pathname).toBe('/login');
  });
  it('redirects to login on admin route', () => {
    const { history } = renderWithRouter(<App />, {
      route: '/admin/user-list',
    });

    expect(history.location.pathname).toBe('/login');
  });
  it("returns '404 Not Found' on bad route", () => {
    renderWithRouter(<App />, { route: '/nonexisting-route' });
    expect(screen.getByText(/404 Not Found/i)).toBeInTheDocument();
  });

  it('"sign in" link goes to /login', async () => {
    renderWithRouter(<App />);
    expect(screen.getByRole('link', { name: 'sign in' })).toHaveAttribute(
      'href',
      '/login'
    );
  });
});
