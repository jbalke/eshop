import React from 'react';
import Product from '../components/Product';
import { useQueryClient, useQuery } from 'react-query';
import { getProducts, getProduct } from '../api/products';
import Loader from '../components/Loader';
import Message from '../components/Message';

const Home = () => {
  const { isLoading, isError, data, error } = useQuery('products', getProducts);
  const queryClient = useQueryClient();

  const prefetchProduct = async (id) => {
    await queryClient.prefetchQuery(['product', id], getProduct(id));
  };

  return (
    <>
      <h1>Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
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
      )}
    </>
  );
};

export default Home;
