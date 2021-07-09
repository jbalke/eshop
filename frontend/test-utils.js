import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import store from './src/store';

const AllTheProviders = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

// test utils file
const renderWithRouter = (
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    ...options
  } = {}
) => ({
  ...render(<Router history={history}>{ui}</Router>, {
    wrapper: AllTheProviders,
    ...options,
  }),
  history,
});

const renderWithClient = (
  client,
  ui,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    options,
  } = {}
) => {
  const { rerender, ...result } = render(
    <QueryClientProvider client={client}>
      <Router history={history}>{ui}</Router>
    </QueryClientProvider>,
    { wrapper: AllTheProviders, ...options }
  );
  return {
    ...result,
    rerender: (rerenderUi) =>
      rerender(
        <QueryClientProvider client={client}>{rerenderUi}</QueryClientProvider>
      ),
  };
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render, renderWithRouter, renderWithClient };
