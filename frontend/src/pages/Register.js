import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useHistory } from 'react-router-dom';
import ApiService from '../api/ApiService.js';
import Message from '../components/Message.js';
import { useQueryString } from '../hooks/url.js';
import tokenStorage from '../tokenStorage.js';

function Register() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const searchParams = useQueryString();
  const redirect = searchParams.get('redirect') || '/';
  const history = useHistory();

  const queryClient = useQueryClient();
  const { mutate, isSuccess, data, isError, error } = useMutation(
    ApiService.users.registerUser,
    {
      onSuccess: (data) => {
        tokenStorage.setToken(data.token);
        queryClient.setQueryData('userPing', { user: data.user });
      },
    }
  );

  useEffect(() => {
    if (isSuccess) {
      history.push(redirect);
    }
  }, [isSuccess, history, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage(null);
    mutate({ name, email, password });
  };

  return (
    <div className='login-layout sm:w-full md:w-1/3 mx-auto'>
      <h1 className=''>Register</h1>
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
              autoComplete='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
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
              minLength='6'
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
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
        Already have an account?{' '}
        <Link
          to={redirect ? `/login?redirect=${redirect}` : '/login'}
          className=''
        >
          Sign In
        </Link>
      </div>
      {message && <Message type='danger'>{message}</Message>}
      {isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : isSuccess ? (
        <Message type='success'>{`Welcome ${data.user.name}!`}</Message>
      ) : null}
    </div>
  );
}

export default Register;
