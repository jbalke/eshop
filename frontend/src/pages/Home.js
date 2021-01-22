import React from 'react';
import products from '../data/products';
import Product from '../components/Product';

const Home = () => {
  return (
    <>
      <h1>Latest Products</h1>
      <div className='products-grid'>
        {products.map((product, i) => {
          return <Product key={i} {...product} />;
        })}
      </div>
    </>
  );
};

export default Home;
