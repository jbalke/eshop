import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ApiService from '../api/ApiService.js';
import Message from '../components/Message.js';
import { useUserProfile } from '../hooks/userQueries';
import tokenStorage from '../tokenStorage.js';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();
  const location = useLocation();

  let { from } = location.state || { from: { pathname: '/' } };

  const { data: userInfo } = useUserProfile();

  const queryClient = useQueryClient();
  const { mutate, isSuccess, data, isError, error } = useMutation(
    ApiService.users.loginUser,
    {
      onSuccess: (data) => {
        tokenStorage.setToken(data.token);
        queryClient.setQueryData('myProfile', { user: data.user });
        history.replace(from);
      },
    }
  );

  useEffect(() => {
    if (userInfo?.user) {
      history.replace(from);
    }
  }, [userInfo, history, from]);

  const submitHandler = async (e) => {
    e.preventDefault();
    mutate({ email, password });
  };

  return (
    <div className='login-layout sm:w-full md:w-1/3 mx-auto'>
      <h1 className=''>Sign In</h1>
      <form onSubmit={submitHandler}>
        <section className='form-email'>
          <label>
            Email Address
            <input
              type='email'
              name='email'
              placeholder='email address'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </label>
        </section>
        <section className='form-password'>
          <label>
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
        </section>
        <section>
          <button type='submit' className='btn primary my-2'>
            Sign In
          </button>
        </section>
      </form>
      <div className='my-3 text-center text-sm'>
        New Customer?{' '}
        <Link to={{ pathname: '/register', state: { from } }} className=''>
          Register
        </Link>
      </div>
      {isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : isSuccess ? (
        <Message type='success'>{`Welcome back ${data.name}!`}</Message>
      ) : null}
    </div>
  );
}

export default Login;
