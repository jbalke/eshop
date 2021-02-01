import React from 'react';
import Rating from './Rating';
import { Link } from 'react-router-dom';

const Product = ({ _id, image, name, rating, numReviews, price, prefetch }) => {
  return (
    <article className='card' onMouseEnter={prefetch}>
      <Link to={`/product/${_id}`}>
        <img src={image} alt={name} />
      </Link>
      <div>
        <Link to={`/product/${_id}`}>
          <h1 className='text-base font-semibold tracking-wide capitalize'>
            {name}
          </h1>
        </Link>
        <div className=''>
          <Rating value={rating} text={`${numReviews} reviews`} />
          <h2 className='text-2xl font-bold tracking-widest my-4'>${price}</h2>
        </div>
      </div>
    </article>
  );
};

export default Product;
