import React from 'react';
import { FaEdit } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';

const StockList = () => {
  const { isLoading, data, isError, error, isFetching } = useQuery(
    'stock',
    ApiService.admin.getStockLevels,
    {
      staleTime: 0,
    }
  );

  return (
    <div>
      <Meta title='E-Shop | Stock List' />
      <div className='flex justify-between items-center'>
        <h1>Stock List {isFetching && <span>...</span>}</h1>
      </div>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
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
              {data.map((product) => (
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
      )}
    </div>
  );
};

export default StockList;
