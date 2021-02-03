import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useHistory } from 'react-router-dom';
import ApiService from '../api/ApiService.js';
import Message from '../components/Message.js';
import { useQueryString } from '../hooks/url.js';
import tokenStorage from '../tokenStorage.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const searchParams = useQueryString();
  const redirect = searchParams.get('redirect') || '/';
  const history = useHistory();

  const { data: userInfo } = useQuery('user', ApiService.users.userProfile);

  const queryClient = useQueryClient();
  const { mutate, isSuccess, data, isError, error } = useMutation(
    ApiService.users.loginUser,
    {
      onSuccess: (data) => {
        tokenStorage.setToken(data.token);
        queryClient.setQueryData('user', data.user);
      },
    }
  );

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  useEffect(() => {
    if (isSuccess) {
      history.replace(redirect);
    }
  }, [isSuccess, history, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className='login-layout sm:w-full md:w-1/3 mx-auto'>
      <h1 className=''>Sign In</h1>
      <form onSubmit={submitHandler}>
        <div className='form-email'>
          <label htmlFor='email'>
            Email Address
            <input
              className='w-full'
              type='email'
              name='email'
              placeholder='email address'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <button
          type='submit'
          className='btn my-2 border border-black bg-gray-700 text-white'
        >
          Sign In
        </button>
      </form>
      <div className='my-3 text-center text-sm'>
        New Customer?{' '}
        <Link
          to={redirect ? `/register?redirect=${redirect}` : '/register'}
          className=''
        >
          Register
        </Link>
      </div>
      {isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : isSuccess ? (
        <Message type='success'>{`Welcome back ${data.name}`}</Message>
      ) : null}
    </div>
  );
}

export default Login;
