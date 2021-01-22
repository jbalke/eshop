import React from 'react';
import Product from '../components/Product';
import { useQuery } from 'react-query';
import { getProducts } from '../api/products';

const Home = () => {
  const { isLoading, isError, data, error } = useQuery('products', getProducts);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <>
      <h1>Latest Products</h1>
      <div className='products-grid'>
        {data.map((product, i) => {
          return <Product key={i} {...product} />;
        })}
      </div>
    </>
  );
};

export default Home;
