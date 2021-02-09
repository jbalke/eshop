import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [name, setName] = useState(shippingAddress.name);
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postCode, setPostCode] = useState(shippingAddress.postCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const history = useHistory();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ name, address, city, postCode, country }));
    history.push('/payment');
  };

  return (
    <div className='sm:w-full md:max-w-md mx-auto'>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <form onSubmit={submitHandler}>
        <div className='form-address'>
          <label htmlFor='name'>
            Address
            <input
              className='w-full'
              type='text'
              name='name'
              placeholder='your name'
              autoComplete='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>
        <div className='form-address'>
          <label htmlFor='address'>
            Address
            <input
              className='w-full'
              type='text'
              name='address'
              placeholder='street address'
              autoComplete='address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </label>
        </div>
        <div className='form-address'>
          <label htmlFor='city'>
            Town / City
            <input
              className='w-full'
              type='text'
              name='city'
              placeholder='town or city'
              autoComplete='city'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
        </div>
        <div className='form-address'>
          <label htmlFor='postCode'>
            Post Code
            <input
              className='w-full'
              type='text'
              name='postCode'
              placeholder='post code'
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              required
            />
          </label>
        </div>
        <div className='form-address'>
          <label htmlFor='country'>
            Country
            <input
              className='w-full'
              type='text'
              name='country'
              placeholder='country'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>
        </div>
        <button type='submit' className='btn primary mt-6'>
          Continue
        </button>
      </form>
    </div>
  );
};

export default Shipping;
