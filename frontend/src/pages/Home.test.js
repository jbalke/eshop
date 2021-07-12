import { screen } from '@testing-library/react';
import * as React from 'react';
import { QueryClient } from 'react-query';
import { renderWithClient } from 'test-utils';
import Home from './Home';

jest.mock('../components/Product', () => () => <div>Product Listing</div>);
jest.mock('../components/ProductCarousel', () => () => <div>Slider</div>);
jest.mock('use-resize-observer', () => () => ({ width: 1000 }));

describe('Home', () => {
  it('renders latest products', async () => {
    const queryClient = new QueryClient();
    renderWithClient(queryClient, <Home appLimit={2} setAppLimit={() => {}} />);

    expect(await screen.findAllByText('Product Listing')).toHaveLength(2);
  });
});
