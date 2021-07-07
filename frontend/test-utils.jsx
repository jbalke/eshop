import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const queryClient = new QueryClient();

const AllTheProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
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

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render, renderWithRouter };
