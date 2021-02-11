import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import ApiService from '../api/ApiService';
import { ScrollToTop } from '../utils/scroll';
import ProductDetail from '../components/ProductDetail';
import Loader from '../components/Loader';
import Message from '../components/Message';

function Product() {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const { isError, error, data, isLoading } = useQuery(
    ['product', id],
    ApiService.products.getProduct(id),
    {
      initialData: () =>
        queryClient
          .getQueryData('products')
          ?.find((product) => product._id === id),
    }
  );

  return (
    <>
      <ScrollToTop />
      <Link className='btn secondary mb-2' to='/'>
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
