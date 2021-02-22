import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useLocation } from 'react-router-dom';
import ApiService from '../api/ApiService';
import ItemLimit from '../components/ItemLimit';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Product from '../components/Product';

const Home = ({ limit, setLimit }) => {
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

  return (
    <>
      <h1>Latest Products {isFetching && <span>...</span>}</h1>
      {isIdle ? null : isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
        <div className='flex-grow flex flex-col justify-between'>
          <div>
            <ItemLimit limit={limit} keyword={keyword} />
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
          </div>
          <div className='mt-4 w-1/2 mx-auto'>
            <Paginate
              page={page}
              pages={data?.pages}
              keyword={keyword}
              isPreviousData={isPreviousData}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
