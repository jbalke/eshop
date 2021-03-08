import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import useResizeObserver from 'use-resize-observer';
import ApiService from '../api/ApiService';
import ItemLimit from '../components/ItemLimit';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';
import Product from '../components/Product';
import ProductCarousel from '../components/ProductCarousel';
import SearchBox from '../components/SearchBox';
import { useQuerySearchParams } from '../hooks/useQuerySearchParams';

const Home = ({ appLimit, setAppLimit }) => {
  const { limit, keyword, page } = useQuerySearchParams(appLimit, setAppLimit);

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
    if (page < data?.pages) {
      queryClient.prefetchQuery(
        ['products', { keyword, page: page + 1, limit }],
        ApiService.products.getProducts,
        { staleTime: 0 }
      );
    }
  }, [data, queryClient, keyword, page, limit]);

  const { width: bodyWidth } = useResizeObserver({ ref: document.body });

  return (
    <>
      <Meta title='Welcome to E-Shop' />
      <SearchBox />
      {!keyword && bodyWidth > 600 && <ProductCarousel />}
      <h1>Latest Products {isFetching && <span>...</span>}</h1>
      {isIdle ? null : isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
        <div className='flex-grow flex flex-col justify-between'>
          <div>
            <ItemLimit limit={limit} keyword={keyword} />
            {data?.products.length > 0 ? (
              <div className='products-grid'>
                {data.products.map((product) => {
                  return <Product key={product._id} {...product} />;
                })}
              </div>
            ) : (
              <Message>No products found</Message>
            )}
          </div>
          <div className='mt-4 w-1/2 mx-auto'>
            <Paginate
              limit={limit}
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
