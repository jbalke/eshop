import React, { useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import tokenStorage from '../tokenStorage';
import Meta from '../components/Meta';

const Logout = () => {
  const queryClient = useQueryClient();

  const { isSuccess, mutate } = useMutation(ApiService.users.logoutUser, {
    onSuccess: () => {
      toast.info('You are now logged out');

      tokenStorage.clearToken();
      queryClient.setQueryData('myProfile', { user: null });
      queryClient.removeQueries('myOrders');
      queryClient.removeQueries('users');
      queryClient.removeQueries('userDetails');
      queryClient.removeQueries('userOrders');
      queryClient.removeQueries('order');
    },
    onError: () => {
      toast.error('Oops, unable to log you out. Please try again.', {
        autoClose: 5000,
      });
    },
  });

  const history = useHistory();

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (isSuccess) {
      history.replace('/');
    }
  }, [isSuccess, history]);

  return (
    <>
      <Meta title='E-Shop | Logging Out' />
      <div className='max-w-sm mx-auto'>
        <Loader />
      </div>
    </>
  );
};

export default Logout;
