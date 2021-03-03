import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaTimes } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { formatDataTime } from '../utils/dates';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  const { register, watch } = useForm({
    defaultValues: { showUndeliveredOnly: false },
  });
  const watchShowUndeliveredOnly = watch('showUndeliveredOnly');

  const { data, isSuccess, isLoading, isError, error } = useQuery(
    'orders',
    ApiService.admin.getOrders
  );

  useEffect(() => {
    if (isSuccess && watchShowUndeliveredOnly) {
      const filteredOrders = data.filter((order) => !order.isDelivered);
      setOrders(filteredOrders);
    } else {
      setOrders(data);
    }
  }, [isSuccess, data, watchShowUndeliveredOnly]);

  return (
    <div>
      <Meta title='E-Shop | Order List' />
      <div className='flex justify-between items-center'>
        <h1>Orders</h1>
        <form className='flex items-center border p-2'>
          <label htmlFor='undelivered' className='inline'>
            undelivered only
          </label>
          <input
            type='checkbox'
            id='undelivered'
            className='inline ml-2'
            ref={register}
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
