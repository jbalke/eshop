import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { Link, useHistory, useLocation } from 'react-router-dom';
import ApiService from '../api/ApiService.js';
import InputWarning from '../components/InputWarning';
import Message from '../components/Message.js';
import Meta from '../components/Meta';
import tokenStorage from '../tokenStorage.js';

function Register() {
  const [message, setMessage] = useState(null);

  const recaptchaRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    errors,
    getValues,
    formState: { isValid },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const history = useHistory();

  const location = useLocation();
  let { from = { pathname: '/' } } = location.state;

  const queryClient = useQueryClient();
  const { mutate, isSuccess, data, isError, error, isLoading } = useMutation(
    ApiService.users.registerUser,
    {
      onSuccess: (data) => {
        tokenStorage.setToken(data.token);
        queryClient.setQueryData('myProfile', { user: data.user });
      },
      onError: (error) => {
        recaptchaRef.current?.reset();
      },
    }
  );

  useEffect(() => {
    if (isSuccess) {
      history.replace(from);
    }
  }, [isSuccess, history, from]);

  const validateEmail = (value) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value) || 'Not a valid address';
  };

  const validatePassword = (value) => {
    return (
      [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9\s]/].every((pattern) =>
        pattern.test(value)
      ) ||
      `Must include at least one lowercase, uppercase, number and special character.`
    );
  };

  const validateConfirmPassword = (value) => {
    return value === getValues('password');
  };

  const onSubmit = async (data) => {
    const { name, email, password } = data;
    const token = await recaptchaRef.current.executeAsync();

    setMessage(null);
    mutate({ name, email, password, token });
  };

  return (
    <div className='login-layout sm:w-full md:w-1/3 mx-auto'>
      <Meta title='E-Shop | Register' />
      <h1 className=''>Register</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <label>
            Name
            <input
              className='w-full'
              name='name'
              type='text'
              placeholder='name'
              autoComplete='name'
              ref={register({
                required: 'Required',
                minLength: {
                  value: 5,
                  message: 'Must be 5 or more characters',
                },
              })}
              aria-required='true'
              aria-describedby='nameDescription'
            />
          </label>
          <div className='subtext mt-0.5' id='nameDescription'>
            Name must be 5 characters or more. Your name will be visible to
            others.
          </div>
          {errors.name && <InputWarning message={errors.name.message} />}
        </section>
        <section>
          <label>
            Email Address
            <input
              className='w-full'
              name='email'
              type='email'
              placeholder='email address'
              autoComplete='email'
              ref={register({ required: 'Required', validate: validateEmail })}
              aria-required='true'
              aria-describedby='emailDescription'
            />
          </label>
          <div className='subtext mt-0.5' id='emailDescription'>
            We will never share your email address or send you spam.
          </div>
          {errors.email && <InputWarning message={errors.email.message} />}
        </section>
        <section>
          <label>
            Password
            <input
              className='w-full'
              name='password'
              type='password'
              placeholder='password'
              autoComplete='new-password'
              ref={register({
                required: 'Required',
                minLength: {
                  value: 6,
                  message: 'Must be 6 or more characters',
                },
                validate: validatePassword,
              })}
              aria-required='true'
              aria-describedby='passwordDescription'
            />
          </label>
          <div className='subtext mt-0.5' id='passwordDescription'>
            Password must be 6 characters or more and include at least one
            lowercase, uppercase, number and special character.
          </div>
          {errors.password && (
            <InputWarning message={errors.password.message} />
          )}
        </section>
        <section>
          <label>
            Confirm Password
            <input
              className='w-full'
              name='confirmPassword'
              type='password'
              placeholder='confirm password'
              autoComplete='new-password'
              ref={register({ validate: validateConfirmPassword })}
              aria-required='true'
              aria-describedby='confirmPasswordDescription'
            />
          </label>
          <div className='sr-only' id='confirmPasswordDescription'>
            Enter your new password again to confirm.
          </div>
          {errors.confirmPassword && (
            <InputWarning message='Passwords do not match' />
          )}
        </section>
        <section>
          <button
            type='submit'
            className='btn primary my-2'
            disabled={!isValid || isLoading}
          >
            Register
          </button>
        </section>
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_CLIENT_KEY}
          size='invisible'
          ref={recaptchaRef}
        />
      </form>
      <div className='my-3 text-center text-sm'>
        Already have an account?{' '}
        <Link to={{ pathname: `/login`, state: { from } }}>Sign In</Link>
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
