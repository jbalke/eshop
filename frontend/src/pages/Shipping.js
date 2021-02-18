import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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

  const dispatch = useDispatch();
  const history = useHistory();

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
        <section className='form-address'>
          <label>
            Name
            <input
              type='text'
              placeholder='your name'
              autoComplete='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full'
              required
            />
          </label>
        </section>
        <section className='form-address'>
          <label>
            Address
            <input
              type='text'
              placeholder='street address'
              autoComplete='address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className='w-full'
              required
            />
          </label>
        </section>
        <section className='form-address'>
          <label>
            Town / City
            <input
              type='text'
              placeholder='town or city'
              autoComplete='city'
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className='w-full'
              required
            />
          </label>
        </section>
        <section className='form-address'>
          <label>
            Post Code
            <input
              type='text'
              placeholder='post code'
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              className='w-full'
              required
            />
          </label>
        </section>
        <section className='form-address'>
          <label>
            Country
            <input
              type='text'
              placeholder='country'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className='w-full'
              required
            />
          </label>
        </section>
        <button type='submit' className='btn primary mt-6'>
          Continue
        </button>
      </form>
    </div>
  );
};

export default Shipping;
