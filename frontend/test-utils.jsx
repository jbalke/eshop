import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

const queryClient = new QueryClient();

const AllTheProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

// test utils file
const customRender = (ui, { route = '/', ...options } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
