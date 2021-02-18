import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import { useParams, useRouteMatch } from 'react-router-dom';

const Home = () => {
  const { keyword } = useParams();
  const { url } = useRouteMatch();

  const { isLoading, isError, data, error, refetch } = useQuery(
    'products',
    ApiService.products.getProducts(keyword),
    {
      refetchOnWindowFocus: false,
      staleTime: 0,
    }
  );

  useEffect(() => {
    refetch();
  }, [refetch, url]);

  return (
    <>
      <h1>Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
        <div className='products-grid'>
          {data.map((product) => {
            return <Product key={product._id} {...product} />;
          })}
        </div>
      )}
    </>
  );
};

export default Home;
