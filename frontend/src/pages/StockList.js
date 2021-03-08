import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ApiService from '../api/ApiService';
import ItemLimit from '../components/ItemLimit';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import Paginate from '../components/Paginate';
import SearchBox from '../components/SearchBox';
import { useQuerySearchParams } from '../hooks/useQuerySearchParams';

const StockList = () => {
  const { limit, keyword, page } = useQuerySearchParams();

  const {
    isLoading,
    data,
    isError,
    error,
    isFetching,
    isPreviousData,
  } = useQuery(
    ['stock', { keyword, page, limit }],
    ApiService.admin.getStockLevels,
    {
      refetchOnWindowFocus: false,
      staleTime: 0,
      keepPreviousData: true,
    }
  );

  return (
    <>
      <Meta title='E-Shop | Stock List' />
      <div className='flex-grow flex flex-col justify-between'>
        <div>
          <SearchBox />
          <h1>Stock List {isFetching && <span>...</span>}</h1>
          <ItemLimit keyword={keyword} limit={limit} step={25} />
          {isLoading ? (
            <Loader />
          ) : isError ? (
            <Message type='danger'>{error.message}</Message>
          ) : data.stock?.length > 0 ? (
            <div className='overflow-x-scroll md:overflow-x-auto'>
              <table className='product-list'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>BRAND</th>
                    <th>CATEGORY</th>
                    <th>QTY TO SHIP</th>
                    <th>QTY REMAINING</th>
                  </tr>
                </thead>
                <tbody>
                  {data.stock?.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <Link to={`/admin/product/${product.id}/edit`}>
                          {product.id}
                        </Link>
                      </td>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{product.category}</td>
                      <td>{product.qtyToDeliver}</td>
                      <td>{product.qtyToSell}</td>
                      <td className='flex items-center justify-around'>
                        <Link
                          to={`/admin/product/${product.id}/edit`}
                          className='btn primary'
                          title='Edit'
                        >
                          <FaEdit fill='white' />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Message>No products found</Message>
          )}
        </div>
        <div className='mt-4 w-1/2 mx-auto'>
          <Paginate
            limit={limit}
            pages={data?.pages}
            page={page}
            isPreviousData={isPreviousData}
          />
        </div>
      </div>
    </>
  );
};

export default StockList;
