import React from 'react';
import { Link } from 'react-router-dom';
import Rating from '../components/Rating';
import { useQuery } from 'react-query';
import { getProduct } from '../api/products';
import { ScrollToTop } from '../utils/scroll';

function Product({ match }) {
  const { id } = match.params;
  const { isError, error, data, isLoading } = useQuery(
    ['product', id],
    getProduct(id),
    { staleTime: 10 * 1000 }
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const {
    name,
    image,
    rating,
    numReviews,
    description,
    countInStock,
    price,
  } = data;

  const inStock = countInStock > 0;
  return (
    <>
      <ScrollToTop />
      <Link
        className='btn text-xs my-3 text-black bg-gray-100  hover:bg-gray-400 hover:text-white'
        to='/'
      >
        Go Back
      </Link>
      <article className='product-layout'>
        <img src={image} alt={name} className='w-full cover object-center' />
        <section className=''>
          <h1 className=''>{name}</h1>
          <Rating value={rating} text={`${numReviews} reviews`} />
          <h2 className='not-visible'>Product Description</h2>
          <p>{description}</p>
        </section>
        <section className='stock-info-layout'>
          <h1 className='not-visible'>Stock Information</h1>
          <span className='font-bold'>Price:</span>
          <span>${price}</span>
          <span className='font-bold'>Status:</span>
          <span>{inStock ? 'In Stock' : 'Out of Stock'}</span>
          <button
            className='btn text-xs text-white bg-gray-700 col-span-2 place-self-stretch hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed'
            disabled={!inStock}
          >
            add to cart
          </button>
          <div></div>
        </section>
      </article>
    </>
  );
}

export default Product;
