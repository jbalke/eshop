import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { getDate } from '../utils/dates';

const UserProfile = () => {
  const { id } = useParams();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();

  const userProfileInfo = useQuery(
    ['userDetails', id],
    ApiService.admin.getUserDetails(id),
    {
      onSuccess: (data) => {
        setName(data.user.name);
        setEmail(data.user.email);
        setIsAdmin(data.user.isAdmin);
      },
      staleTime: 0,
    }
  );

  const { mutateAsync } = useMutation(ApiService.admin.updateUser(id), {
    onSuccess: (data) => {
      toast.success('User updated');
      queryClient.setQueryData(['userDetails', id], { user: data.user });
      queryClient.setQueryData('users', (oldData) => {
        return oldData.map((user) => {
          if (user._id === data.user._id) return data.user;

          return user;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message, { autoClose: 5000 });
    },
  });

  const ordersInfo = useQuery(
    ['userOrders', id],
    ApiService.admin.getUserOrders(id)
  );

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await mutateAsync({ name, email, isAdmin });
      setIsEditing(false);
    } catch (error) {}
  };

  const editHandler = (e) => {
    e.preventDefault();

    setIsEditing(true);
  };

  const cancelHandler = () => {
    setIsEditing(false);
    userProfileInfo.refetch();
  };

  return (
    <>
      <Link to={`/admin/user-list`} className='btn secondary'>
        &larr; Go Back
      </Link>
      <div className='flex flex-col md:flex-row'>
        <section className='md:w-1/5'>
          <h1>User</h1>
          {userProfileInfo.isLoading ? (
            <Loader />
          ) : userProfileInfo.isError ? (
            <Message type='danger'>{userProfileInfo.error.message}</Message>
          ) : (
            <form onSubmit={submitHandler}>
              <section className='form-name'>
                <label>
                  Name
                  <input
                    type='text'
                    minLength='2'
                    placeholder='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </label>
              </section>
              <section className='form-email'>
                <label>
                  Email Address
                  <input
                    type='email'
                    placeholder='email address'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!isEditing}
                    required
                  />
                </label>
              </section>
              <section className='form-is-admin flex justify-between items-center'>
                <label htmlFor='isAdmin'>Admin</label>
                <input
                  type='checkbox'
                  id='isAdmin'
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  disabled={!isEditing}
                />
              </section>
              {isEditing ? (
                <section>
                  <button type='submit' className='btn primary'>
                    Update
                  </button>
                  <button
                    type='button'
                    className='btn primary ml-3'
                    onClick={cancelHandler}
                  >
                    Cancel
                  </button>
                </section>
              ) : (
                <section>
                  <button
                    type='button'
                    className='btn primary'
                    onClick={editHandler}
                  >
                    Change
                  </button>
                </section>
              )}
            </form>
          )}
        </section>
        <section className='md:ml-5'>
          <h1>Orders</h1>
          {ordersInfo.isLoading ? (
            <Loader />
          ) : ordersInfo.isError ? (
            <Message type='danger'>{ordersInfo.error.message}</Message>
          ) : ordersInfo.data?.length > 0 ? (
            <div className='overflow-x-scroll md:overflow-x-auto'>
              <table className='my-orders'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersInfo.data.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/order/${order._id}`}>{order._id}</Link>
                      </td>
                      <td>{getDate(order.createdAt)}</td>
                      <td>${order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          getDate(order.paidAt)
                        ) : (
                          <FaTimes fill='red' className='mx-auto' />
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          getDate(order.deliveredAt)
                        ) : (
                          <FaTimes fill='red' className='mx-auto' />
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/order/${order._id}`}
                          className='btn secondary small'
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
            <Message>No orders</Message>
          )}
        </section>
      </div>
    </>
  );
};

export default UserProfile;
