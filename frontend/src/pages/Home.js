import React from 'react';
import { useQuery } from 'react-query';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';

const Home = () => {
  const { isLoading, isError, data, error } = useQuery(
    'products',
    ApiService.products.getProducts
  );

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
            return <Product key={product._id} {...product} />;
          })}
        </div>
      )}
    </>
  );
};

export default Home;
