import React from 'react';
import Rating from './Rating';
import { useHistory } from 'react-router-dom';
const ProductDetail = ({
  _id,
  name,
  image,
  rating,
  numReviews,
  description,
  countInStock,
  price,
}) => {
  const [qty, setQty] = React.useState(1);
  const history = useHistory();

  const addToCartHandler = () => {
    history.push(`/cart/${_id}?qty=${qty}`);
  };

  const inStock = countInStock > 0;

  return (
    <article className='product-layout'>
      <img src={image} alt={name} className='w-full cover object-center' />
      <section className=''>
        <h1 className=''>{name}</h1>
        <Rating value={rating} text={`${numReviews} reviews`} />
        <h2 className='sr-only'>Product Description</h2>
        <p>{description}</p>
      </section>
      <section className='stock-info-layout'>
        <h1 className='sr-only'>Stock Information</h1>
        <span className='font-bold'>Price:</span>
        <span>${price}</span>
        <span className='font-bold'>Status:</span>
        <span>{inStock ? 'In Stock' : 'Out of Stock'}</span>
        {inStock && (
          <>
            <span>Qty:</span>
            <select
              name='qty'
              id='qty'
              className='border py-2 px-4 justify-self-stretch'
              value={qty}
              onChange={(e) => {
                setQty(e.target.value);
              }}
            >
              {Array.from({ length: countInStock }, (v, i) => i + 1).map(
                (v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                )
              )}
            </select>
          </>
        )}
        <button
          className='btn shadow-md text-xs text-white bg-gray-700 col-span-2 justify-self-stretch hover:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed'
          disabled={!inStock}
          onClick={addToCartHandler}
          type='button'
        >
          add to cart
        </button>
      </section>
    </article>
  );
};

export default ProductDetail;
