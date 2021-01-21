import React from 'react';
import products from '../data/products';
import Product from '../components/Product';

const Home = () => {
  return (
    <>
      <h1>Latest Products</h1>
      <div className='grid gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-col-6'>
        {products.map((product, i) => {
          return <Product key={i} {...product} />;
        })}
      </div>
    </>
  );
};

export default Home;
