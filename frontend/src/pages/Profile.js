import React, { useEffect, useState } from 'react';
import ApiService from '../api/ApiService';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useHistory, useLocation } from 'react-router-dom';
import { sleep } from '../utils/sleep';

const Profile = () => {
  const history = useHistory();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const queryClient = useQueryClient();
  const userProfileInfo = useQuery(
    'userProfile',
    ApiService.users.getUserProfile,
    {
      onSuccess: (data) => {
        setName(data.user.name);
        setEmail(data.user.email);
        setPassword('dummy password');
      },
    }
  );

  const { isError, error, isSuccess, mutateAsync, reset } = useMutation(
    ApiService.users.updateUserProfile,
    {
      onSuccess: (data) => {
        queryClient.setQueryData('userProfile', { user: data.user });
      },
    }
  );

  useEffect(() => {
    if (userProfileInfo.isError) {
      sleep(2).then(() => {
        history.replace(`/login?redirect=${location.pathname}`);
      });
    }
  }, [userProfileInfo.isError, location, history]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage(null);

    try {
      await mutateAsync({ name, email, password });
      userProfileInfo.refetch();
      setIsEditing(false);
    } catch (error) {}
  };

  const editHandler = () => {
    setPassword('');
    reset();
    setIsEditing(true);
  };

  const cancelHandler = () => {
    setPassword('dummy password');
    reset();
    setIsEditing(false);
    userProfileInfo.refetch();
  };

  return (
    <div className='flex sm:flex-col md:flex-row'>
      <div className='w-2/5'>
        <h1>Profile</h1>
        {userProfileInfo.isLoading ? (
          <Loader />
        ) : userProfileInfo.isError ? (
          <Message type='danger'>{userProfileInfo.error.message}</Message>
        ) : (
          <form onSubmit={submitHandler}>
            <div className='form-email'>
              <label htmlFor='email'>
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
            </div>
            <div className='form-email'>
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
            </div>
            <div className='form-password'>
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
            </div>
            {isEditing && (
              <div className='form-password'>
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
              </div>
            )}
            {isEditing ? (
              <div className='my-6'>
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
              </div>
            ) : (
              <button
                type='button'
                className='btn primary'
                onClick={editHandler}
              >
                Change
              </button>
            )}
          </form>
        )}
        {message && <Message type='danger'>{message}</Message>}
        {isError ? (
          <Message type='danger'>{error.message}</Message>
        ) : isSuccess ? (
          <Message type='success'>{`Profile Updated`}</Message>
        ) : null}
      </div>
      <div className='w-full md:ml-10'>
        <h1>My Orders</h1>
      </div>
    </div>
  );
};

export default Profile;
