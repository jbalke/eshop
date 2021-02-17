import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { formatDataTime } from '../utils/dates';

const OrderList = () => {
  const [filterUndelivered, setFilterUndelivered] = useState(false);
  const [orders, setOrders] = useState([]);

  const { data, isSuccess, isLoading, isError, error } = useQuery(
    'orders',
    ApiService.admin.getOrders
  );

  useEffect(() => {
    if (isSuccess && filterUndelivered) {
      const filteredOrders = data.filter((order) => !order.isDelivered);
      setOrders(filteredOrders);
    } else {
      setOrders(data);
    }
  }, [isSuccess, data, filterUndelivered]);

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h1>Orders</h1>
        <form className='flex items-center border p-2'>
          <label htmlFor='undelivered' className='inline'>
            undelivered only
          </label>
          <input
            type='checkbox'
            id='undelivered'
            checked={filterUndelivered}
            onChange={() => setFilterUndelivered(!filterUndelivered)}
            className='inline ml-2'
          />
        </form>
      </div>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : orders?.length ? (
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
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <Link to={`/order/${order._id}`}>{order._id}</Link>
                </td>
                <td>{formatDataTime(order.createdAt)}</td>
                <td>
                  {order.user?.name && (
                    <a href={`mailto:${order.user.email}`}>{order.user.name}</a>
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
      ) : (
        <Message type='info'>All orders delivered, yay!</Message>
      )}
    </div>
  );
};

export default OrderList;
