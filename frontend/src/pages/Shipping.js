import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import InputWarning from '../components/InputWarning';

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const { register, handleSubmit, errors } = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: shippingAddress.name,
      address: shippingAddress.address,
      city: shippingAddress.city,
      postCode: shippingAddress.postCode,
      country: shippingAddress.country,
    },
  });

  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = (data) => {
    const { name, address, city, postCode, country } = data;
    dispatch(saveShippingAddress({ name, address, city, postCode, country }));
    history.push('/payment');
  };

  return (
    <div className='sm:w-full md:max-w-md mx-auto'>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className='form-address'>
          <label>
            Name
            <input
              name='name'
              type='text'
              placeholder='your name'
              autoComplete='name'
              className='w-full'
              ref={register({ required: 'Required' })}
              aria-invalid={!!errors.name}
              aria-required
            />
          </label>
          {errors.name && <InputWarning message={errors.name.message} />}
        </section>
        <section className='form-address'>
          <label>
            Address
            <input
              name='address'
              type='text'
              placeholder='street address'
              autoComplete='street-address'
              className='w-full'
              ref={register({ required: 'Required' })}
              aria-invalid={!!errors.address}
              aria-required
            />
          </label>
          {errors.address && <InputWarning message={errors.address.message} />}
        </section>
        <section className='form-address'>
          <label>
            Town / City
            <input
              name='city'
              type='text'
              placeholder='town or city'
              autoComplete='city'
              className='w-full'
              ref={register({ required: 'Required' })}
              aria-invalid={!!errors.email}
              aria-required
            />
          </label>
          {errors.city && <InputWarning message={errors.city.message} />}
        </section>
        <section className='form-address'>
          <label>
            Post Code
            <input
              name='postCode'
              type='text'
              placeholder='post code'
              autoComplete='postal-code'
              ref={register({ required: 'Required' })}
              aria-invalid={!!errors.email}
              className='w-full'
              aria-required
            />
          </label>
          {errors.postCode && (
            <InputWarning message={errors.postCode.message} />
          )}
        </section>
        <section className='form-address'>
          <label>
            Country
            <input
              name='country'
              type='text'
              placeholder='country'
              autoComplete='country'
              ref={register({ required: 'Required' })}
              aria-invalid={!!errors.country}
              className='w-full'
              required
            />
          </label>
          {errors.country && <InputWarning message={errors.country.message} />}
        </section>
        <button type='submit' className='btn primary mt-6'>
          Continue
        </button>
      </form>
    </div>
  );
};

export default Shipping;
