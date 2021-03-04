import React from 'react';
import { Link } from 'react-router-dom';
import { GBP } from '../config/currency';
import Rating from './Rating';

const Product = ({
  _id,
  image,
  name,
  brand,
  rating,
  numReviews,
  price,
  prefetch,
}) => {
  const formattedPrice = GBP(price).format();
  return (
    <article className='card' onMouseEnter={prefetch}>
      <Link to={`/product/${_id}`}>
        <img src={image} alt={name} className='object-cover object-center' />
      </Link>
      <div className=''>
        <Link to={`/product/${_id}`}>
          <h1 className='text-base font-semibold tracking-wide capitalize'>
            {brand} {name}
          </h1>
        </Link>
        <div className=''>
          <Rating value={rating} text={`${numReviews} reviews`} />
          <h2 className='text-2xl font-bold tracking-widest my-4'>
            {formattedPrice}
          </h2>
        </div>
      </div>
    </article>
  );
};

export default Product;
