import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Product from '../components/Product';

const Home = ({ limit, setLimit }) => {
  const history = useHistory();
  const location = useLocation();

  const queryString = new URLSearchParams(location.search);

  const queryPage = Number(queryString.get('page')) || 1;
  const pageNumber = Number.isNaN(queryPage) ? 1 : queryPage;

  const queryKeyword = queryString.get('keyword') || '';
  const queryLimit = queryString.get('limit') || limit;

  const [page, setPage] = useState(pageNumber);
  const [keyword, setKeyword] = useState(queryKeyword);

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
    ['products', { keyword, page, limit }],
    ApiService.products.getProducts,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      staleTime: 0,
      onSuccess: (data) => {
        data.products.forEach((product) =>
          queryClient.setQueryData(['product', product._id], () => product)
        );
      },
    }
  );

  useEffect(() => {
    setPage(pageNumber);
    setKeyword(queryKeyword);
    setLimit(queryLimit);
  }, [pageNumber, queryKeyword, queryLimit, setLimit]);

  useEffect(() => {
    if (pageNumber < data?.pages) {
      queryClient.prefetchQuery(
        [
          'products',
          { keyword: queryKeyword, page: pageNumber + 1, limit: queryLimit },
        ],
        ApiService.products.getProducts,
        { staleTime: 0 }
      );
    }
  }, [data, queryClient, queryKeyword, pageNumber, queryLimit]);

  const prevPageHandler = () => {
    history.push(
      `${location.pathname}?keyword=${keyword}&limit=${limit}&page=${Math.max(
        1,
        page - 1
      )}`
    );
  };

  const nextPageHandler = () => {
    if (page < data?.pages) {
      history.push(
        `${location.pathname}?keyword=${keyword}&limit=${limit}&page=${
          page + 1
        }`
      );
    }
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
              Page: {page} / {data.pages || 1}
              <button
                onClick={nextPageHandler}
                className='btn small disabled:cursor-not-allowed'
                disabled={isPreviousData}
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
                onChange={(e) =>
                  history.push(
                    `${location.pathname}?keyword=${keyword}&limit=${
                      e.target.value
                    }&page=${1}`
                  )
                }
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
