import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetMyOrders } from '../hooks/userQueries';
import tokenStorage from '../tokenStorage';
import { getDate } from '../utils/dates';

const Profile = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const userProfileInfo = useQuery(
    'myProfile',
    ApiService.users.getUserProfile,
    {
      onSuccess: (data) => {
        setName(data.user.name);
        setEmail(data.user.email);
        setPassword('dummy password');
      },
      staleTime: 0,
    }
  );

  const { mutateAsync } = useMutation(ApiService.users.updateUserProfile, {
    onSuccess: (data) => {
      toast.success('Profile updated');
      queryClient.setQueryData('userProfile', { user: data.user });
      tokenStorage.setToken(data.token);
    },
    onError: (error) => {
      toast.success(error.message);
    },
  });

  const myOrdersInfo = useGetMyOrders();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setMessage(null);

    try {
      await mutateAsync({ name, email, password });
      setIsEditing(false);
    } catch (error) {}
  };

  const editHandler = (e) => {
    e.preventDefault();

    setPassword('');
    setConfirmPassword('');
    setIsEditing(true);
  };

  const cancelHandler = () => {
    setPassword('dummy password');
    setIsEditing(false);
    userProfileInfo.refetch();
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <section className='md:w-1/5'>
        <h1>Profile</h1>
        {userProfileInfo.isLoading ? (
          <Loader />
        ) : userProfileInfo.isError ? (
          <Message type='danger'>{userProfileInfo.error.message}</Message>
        ) : (
          <form onSubmit={submitHandler}>
            <section className='form-name'>
              <label htmlFor='name'>
                Name
                <input
                  className='w-full'
                  type='text'
                  name='name'
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
              <label htmlFor='email'>
                Email Address
                <input
                  className='w-full'
                  type='email'
                  name='email'
                  placeholder='email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  required
                />
              </label>
            </section>
            <section className='form-password'>
              <label htmlFor='password'>
                Password
                <input
                  className='w-full'
                  type='password'
                  name='password'
                  placeholder='password'
                  value={password}
                  minLength='6'
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={!isEditing}
                />
              </label>
            </section>
            {isEditing && (
              <section className='form-password'>
                <label htmlFor='password'>
                  Confirm Password
                  <input
                    className='w-full'
                    type='password'
                    name='confirm-password'
                    placeholder='confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </label>
              </section>
            )}
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
        {message && <Message type='danger'>{message}</Message>}
      </section>
      <section className='md:ml-5'>
        <h1>My Orders</h1>
        {myOrdersInfo.isLoading ? (
          <Loader />
        ) : myOrdersInfo.isError ? (
          <Message type='danger'>{myOrdersInfo.error.message}</Message>
        ) : myOrdersInfo.data?.length > 0 ? (
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
                {myOrdersInfo.data.map((order) => (
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
                        <FaTimes fill='red' />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        getDate(order.deliveredAt)
                      ) : (
                        <FaTimes fill='red' />
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
  );
};

export default Profile;
