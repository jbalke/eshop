import { render } from '../test-utils';
import App from './App';

jest.mock('./pages/Home', () => () => <div>Home</div>);

describe('App', () => {
  it('renders successfully', () => {
    const { container } = render(<App />);
    expect(container.innerHTML).toMatch(/E-Shop/i);
  });
});

describe('routing', () => {
  it('renders Home component on root route', () => {
    const { container } = render(<App />, { route: '/' });
    expect(container.innerHTML).toMatch('Home');
  });
});
