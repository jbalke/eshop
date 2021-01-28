import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getProduct } from '../api/products';
import { ScrollToTop } from '../utils/scroll';
import ProductDetail from '../components/ProductDetail';
import Loader from '../components/Loader';
import Message from '../components/Message';

function Product({ match }) {
  const { id } = match.params;
  const { isError, error, data, isLoading } = useQuery(
    ['product', id],
    getProduct(id),
    { staleTime: 10 * 1000 }
  );

  return (
    <>
      <ScrollToTop />
      <Link
        className='btn text-xs my-3 text-black bg-gray-100 hover:bg-gray-400 hover:text-white'
        to='/'
      >
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
        <ProductDetail {...data} />
      )}
    </>
  );
}

export default Product;
