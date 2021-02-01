import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { loginUser } from '../api/users.js';
import { Link } from 'react-router-dom';
import Message from '../components/Message.js';
import Loader from '../components/Loader.js';
import { useQueryString } from '../hooks/url.js';
import tokenStorage from '../tokenStorage.js';

function Login({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const searchParams = useQueryString();
  const redirect = searchParams.get('redirect');

  const {
    mutateAsync,
    isLoading,
    isSuccess,
    data,
    isError,
    error,
  } = useMutation(loginUser);

  const submitHandler = async (e) => {
    e.preventDefault();

    await mutateAsync({ email, password });

    if (isSuccess) {
      tokenStorage.setToken(data.token);
      //TODO: cache user for app header?
    }
  };

  return (
    <div className='login-layout sm:w-full md:w-1/2 mx-auto'>
      <h1>Sign In</h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <form onSubmit={submitHandler}>
            <div className='form-email'>
              <label htmlFor='email'>
                Email Address
                <input
                  type='email'
                  name='email'
                  placeholder='enter email address'
                  autoComplete='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <div className='form-password'>
              <label htmlFor='password'>
                Password
                <input
                  type='password'
                  name='password'
                  placeholder='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <button
              type='submit'
              className='btn border border-black bg-gray-700 text-white font-semibold text-sm'
            >
              Sign In
            </button>
          </form>
          <div className='py-3'>
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
        </>
      )}
    </div>
  );
}

export default Login;
