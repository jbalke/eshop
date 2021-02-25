import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { formatDataTime } from '../utils/dates';
import Meta from '../components/Meta';

const UndeliveredOrderList = () => {
  const { data, isLoading, isError, error } = useQuery(
    'undeliveredOrders',
    ApiService.admin.getUndeliveredOrders
  );

  return (
    <div>
      <Meta title='E-Shop | Undelivered Orders' />
      <h1>Undelivered Orders</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : data.length ? (
        <div className='overflow-x-scroll md:overflow-x-auto'>
          <table className='order-list text-sm w-full'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>CUSTOMER</th>
                <th>PRICE</th>
                <th>PAID</th>
                <th>DELIVERED</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((order) => (
                <tr key={order._id}>
                  <td>
                    <Link to={`/order/${order._id}`}>{order._id}</Link>
                  </td>
                  <td>{formatDataTime(order.createdAt)}</td>
                  <td>
                    {order.user?.name && (
                      <a href={`mailto:${order.user.email}`}>
                        {order.user.name}
                      </a>
                    )}
                  </td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    {order.isPaid ? (
                      formatDataTime(order.paidAt)
                    ) : (
                      <FaTimes fill='red' />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      formatDataTime(order.deliveredAt)
                    ) : (
                      <FaTimes fill='red' />
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/order/${order._id}`}
                      className='btn secondary small'
                      title=''
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Message type='info'>All orders delivered, yay!</Message>
      )}
    </div>
  );
};

export default UndeliveredOrderList;
