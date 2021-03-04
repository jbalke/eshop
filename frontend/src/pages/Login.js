import React, { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ApiService from '../api/ApiService.js';
import InputWarning from '../components/InputWarning';
import Message from '../components/Message.js';
import Meta from '../components/Meta';
import { useUserProfile } from '../hooks/userQueries';
import tokenStorage from '../tokenStorage.js';

function Login() {
  const history = useHistory();
  const location = useLocation();

  const recaptchaRef = React.useRef(null);

  let { from } = location.state || { from: { pathname: '/' } };

  const {
    register,
    handleSubmit,
    errors,
    formState: { isValid },
  } = useForm({
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

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
      onError: (error) => {
        recaptchaRef.current.reset();
      },
    }
  );

  useEffect(() => {
    if (userInfo?.user) {
      history.replace(from);
    }
  }, [userInfo, history, from]);

  const onSubmit = async (data) => {
    const { email, password } = data;
    const token = await recaptchaRef.current.executeAsync();
    mutate({ email, password, token });
  };

  return (
    <>
      <Meta title='E-Shop | Sign In' />
      <div className='login-layout sm:w-full md:w-1/3 mx-auto'>
        <h1 className=''>Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className='form-email'>
            <label>
              Email Address
              <input
                type='email'
                name='email'
                placeholder='email address'
                autoComplete='email'
                className='w-full'
                ref={register({ required: 'Required' })}
                aria-required='true'
                aria-invalid={!!errors.email}
                autoFocus
              />
            </label>
            {errors.email && <InputWarning message={errors.email.message} />}
          </section>
          <section className='form-password'>
            <label>
              Password
              <input
                type='password'
                name='password'
                placeholder='password'
                className='w-full'
                ref={register({ required: 'Required' })}
                aria-required='true'
                aria-invalid={!!errors.password}
              />
            </label>
            {errors.password && (
              <InputWarning message={errors.password.message} />
            )}
          </section>
          <section>
            <button type='submit' className='btn primary my-2'>
              Sign In
            </button>
          </section>
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_RECAPTCHA_CLIENT_KEY}
            size='invisible'
            ref={recaptchaRef}
          />
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
    </>
  );
}

export default Login;
