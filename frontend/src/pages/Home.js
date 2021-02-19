import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';
import { useParams, useRouteMatch } from 'react-router-dom';

const Home = () => {
  const { keyword } = useParams();
  const { url } = useRouteMatch();

  const [page, setPage] = useState(0);
  const [cursors, setCursors] = useState(['']);
  const [limit, setLimit] = useState(2);

  const queryClient = useQueryClient();

  const {
    isIdle,
    isLoading,
    isError,
    data,
    error,
    isFetching,
    isPreviousData,
  } = useQuery(
    ['products', page],
    ApiService.products.getProducts({
      keyword,
      cursor: cursors[page],
      limit,
    }),
    {
      keepPreviousData: true,
      staleTime: 0,
      onSuccess: (data) => {
        console.log('onSuccess');
        data.products.forEach((product) =>
          queryClient.setQueryData(['product', product._id], () => product)
        );

        if (data.cursor) {
          setCursors((old) => {
            if (old.length <= page + 1) {
              return [...old, data.cursor];
            }
            return old.map((cursor, index) =>
              index === page + 1 ? data.cursor : cursor
            );
          });
        }
      },
    }
  );

  useEffect(() => {
    queryClient.removeQueries('products');
    setCursors(['']);
    setPage(0);
  }, [url, queryClient]);

  useEffect(() => {
    if (data?.cursor) {
      queryClient.prefetchQuery(
        ['products', page + 1],
        ApiService.products.getProducts({
          keyword,
          cursor: data.cursor,
          limit,
        }),
        { staleTime: 0 }
      );
    }
  }, [data, queryClient, keyword, page, limit]);

  const prevPageHandler = () => {
    setPage((old) => Math.max(0, old - 1));
  };

  const nextPageHandler = () => {
    setPage((old) => (data.cursor ? old + 1 : old));
  };

  return (
    <>
      <h1>Latest Products</h1>
      {isIdle ? null : isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
        <>
          <div>
            <button
              onClick={prevPageHandler}
              className='btn disabled:cursor-not-allowed'
              disabled={page === 0}
            >
              &larr;
            </button>
            Page: {page + 1} / {Math.ceil(data.matchedProducts / limit) || 1}
            <button
              onClick={nextPageHandler}
              className='btn disabled:cursor-not-allowed'
              disabled={!data.cursor || isPreviousData}
            >
              &rarr;
            </button>
            {isFetching && <span>...</span>}
          </div>
          {data?.products.length ? (
            <div className='products-grid'>
              {data.products.map((product) => {
                return <Product key={product._id} {...product} />;
              })}
            </div>
          ) : (
            <div className='max-w-sm mx-auto'>
              <Message>No products found</Message>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
