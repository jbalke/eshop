import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import ApiService from '../api/ApiService.js';
import { Link, useHistory } from 'react-router-dom';
import Message from '../components/Message.js';
import Loader from '../components/Loader.js';
import { useQueryString } from '../hooks/url.js';
import tokenStorage from '../tokenStorage.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const searchParams = useQueryString();
  const redirect = searchParams.get('redirect');
  const history = useHistory();

  const { mutate, isLoading, isSuccess, data, isError, error } = useMutation(
    ApiService.users.loginUser
  );

  useEffect(() => {
    if (isSuccess) {
      tokenStorage.setToken(data.token);
      history.replace(redirect || '/');
    }
  }, [isSuccess, data, history, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();

    mutate({ email, password });
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
                  required
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
                  required
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
