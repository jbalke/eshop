import React from 'react';
import Rating from './Rating';

const Product = ({ _id, image, name, rating, numReviews, price }) => {
  return (
    <article className='card rounded p-3 shadow-md cursor-pointer flex flex-col transform hover:scale-105 hover:shadow-xl transition-all'>
      <a href={`/product/${_id}`}>
        <img src={image} alt={name} />
      </a>
      <div>
        <a href={`/product/${_id}`}>
          <h1>{name}</h1>
        </a>
        <div className=''>
          <Rating value={rating} text={`${numReviews} reviews`} />
          <h2 className='text-2xl font-bold tracking-widest my-4'>${price}</h2>
        </div>
      </div>
    </article>
  );
};

export default Product;
