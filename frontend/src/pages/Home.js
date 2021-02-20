import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useParams } from 'react-router-dom';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';

const Home = ({ limit, setLimit }) => {
  const { keyword } = useParams();

  const [page, setPage] = useState(0);
  const [cursors, setCursors] = useState(['']);

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
    ['products', { keyword, page }],
    ApiService.products.getProducts({
      keyword,
      cursor: cursors[page],
      limit,
    }),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: 0,
      onSuccess: (data) => {
        data.products.forEach((product) =>
          queryClient.setQueryData(['product', product._id], () => product)
        );

        if (data.cursor) {
          setCursors((old) => {
            if (old.length === page + 1) {
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
    setCursors(['']);
    setPage(0);
  }, [keyword, queryClient, limit]);

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
          <div className='flex justify-between mb-2'>
            <div>
              <button
                onClick={prevPageHandler}
                className='btn small disabled:cursor-not-allowed'
                disabled={page === 0}
              >
                &larr;
              </button>
              Page: {page + 1} / {Math.ceil(data.matchedProducts / limit) || 1}
              <button
                onClick={nextPageHandler}
                className='btn small disabled:cursor-not-allowed'
                disabled={!data.cursor || isPreviousData}
              >
                &rarr;
              </button>
              {isFetching && <span>...</span>}
            </div>
            <div className='flex items-center'>
              <label htmlFor='displayLimit'>items / page</label>
              <select
                name='displayLimit'
                id='displayLimit'
                onChange={(e) => setLimit(e.target.value)}
                value={limit}
                className='ml-1 text-sm'
              >
                {Array.from(
                  { length: 5 },
                  (val, index) => (index + 1) * 12
                ).map((val, i) => (
                  <option key={i} value={val}>
                    {val}
                  </option>
                ))}
                <option value='999'>All</option>
              </select>
            </div>
          </div>
          {data?.products.length ? (
            <div className='products-grid'>
              {data.products.map((product) => {
                return <Product key={product._id} {...product} />;
              })}
            </div>
          ) : (
            <div className='max-w-sm'>
              <Message>No products found</Message>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Home;
