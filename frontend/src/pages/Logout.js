import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import ApiService from '../api/ApiService';
import tokenStorage from '../tokenStorage';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useHistory } from 'react-router-dom';
import { sleep } from '../utils/sleep';

const Logout = () => {
  const queryClient = useQueryClient();

  const { isLoading, isSuccess, mutate, isError, error } = useMutation(
    ApiService.users.logoutUser,
    {
      onSuccess: () => {
        tokenStorage.clearToken();
        queryClient.setQueryData('myProfile', { user: null });
        queryClient.removeQueries('myOrders');
        queryClient.removeQueries('users');
        queryClient.removeQueries('userDetails');
        queryClient.removeQueries('userOrders');
        queryClient.removeQueries('order');
      },
    }
  );

  const history = useHistory();

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (isSuccess) {
      sleep(2).then(() => {
        history.replace('/');
      });
    }
  }, [isSuccess, history]);

  return (
    <div className='max-w-sm mx-auto'>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : isSuccess ? (
        <Message type='success'>Successfully logged out</Message>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Logout;
