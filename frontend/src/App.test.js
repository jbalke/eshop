import { render, renderWithRouter } from '../test-utils';
import App from './App';

jest.mock('./pages/Home', () => () => <div>Home</div>);
jest.mock('./pages/Cart', () => () => <div>Cart</div>);
jest.mock('./pages/Login', () => () => <div>Login</div>);
jest.mock('./pages/Register', () => () => <div>Register</div>);
jest.mock('./pages/Logout', () => () => <div>Logout</div>);
jest.mock('./pages/Product', () => () => <div>Product</div>);

describe('App', () => {
  it('renders successfully', () => {
    const { container } = renderWithRouter(<App />);
    expect(container.innerHTML).toMatch(/E-Shop/i);
  });
});

describe('routing unauthenticated', () => {
  it('renders Home component on root route', () => {
    const { container } = renderWithRouter(<App />, { route: '/' });
    expect(container.innerHTML).toMatch('Home');
  });
  it('renders Register component on /register route', () => {
    const { container } = renderWithRouter(<App />, { route: '/register' });
    expect(container.innerHTML).toMatch('Register');
  });
  it('renders Login component on /login route', () => {
    const { container } = renderWithRouter(<App />, { route: '/login' });
    expect(container.innerHTML).toMatch('Login');
  });
  it('renders Cart component on /cart route', () => {
    const { container } = renderWithRouter(<App />, { route: '/cart' });
    expect(container.innerHTML).toMatch('Cart');
  });
  it("redirects to login on private route", ()=> {
    const {history} = renderWithRouter(<App />, {route: '/me'})

    expect(history.location.pathname).toBe("/login")
  })
  it("redirects to login on admin route", ()=> {
    const {history} = renderWithRouter(<App />, {route: '/admin/user-list'})

    expect(history.location.pathname).toBe("/login")
  })
  it("returns '404 Not Found' on bad route", ()=> {
    const {container} = renderWithRouter(<App />, {route: '/nonexisting-route'})

    expect(container.innerHTML).toMatch(/404 Not Found/i)
  })
  
});
