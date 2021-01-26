import React from 'react';
import Product from '../components/Product';
import { useQueryClient, useQuery } from 'react-query';
import { getProducts, getProduct } from '../api/products';

const Home = () => {
  const { isLoading, isError, data, error } = useQuery(
    'products',
    getProducts,
    { staleTime: 60 * 1000 }
  );
  const queryClient = useQueryClient();

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const prefetchProduct = async (id) => {
    await queryClient.prefetchQuery(`product__${id}`, getProduct(id), {
      staleTime: 10 * 1000, // only prefetch if older than 10 seconds
    });
  };

  return (
    <>
      <h1>Latest Products</h1>
      <div className='products-grid'>
        {data.map((product) => {
          return (
            <Product
              key={product._id}
              {...product}
              // prefetch={(e) => prefetchProduct(product._id)}
            />
          );
        })}
      </div>
    </>
  );
};

export default Home;
