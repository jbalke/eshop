import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const Payment = () => {
  const history = useHistory();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod: defaultPaymentMethod } = cart;

  if (!shippingAddress) {
    history.push('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState(
    defaultPaymentMethod || 'PayPal'
  );

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push('/placeorder');
  };

  return (
    <div className='sm:w-full md:max-w-md mx-auto'>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <form onSubmit={submitHandler}>
        <h2 className='text-xl text-gray-600 font-semibold capitalize'>
          Select Method
        </h2>
        <div className='form-payment'>
          <input
            type='radio'
            name='paymentMethod'
            id='PayPal'
            value='PayPal'
            onChange={(e) => setPaymentMethod(e.target.value)}
            checked={paymentMethod === 'PayPal'}
          />
          <label htmlFor='Paypal'>PayPal or Credit Card</label>
        </div>
        {/* <div className='form-payment'>
          <input
            type='radio'
            name='paymentMethod'
            id='Stripe'
            value='Stripe'
            onChange={(e) => setPaymentMethod(e.target.value)}
            checked={paymentMethod === 'Stripe'}
          />
          <label htmlFor='Stripe'>Stripe</label>
        </div> */}
        <button type='submit' className='btn primary mt-6'>
          Continue
        </button>
      </form>
    </div>
  );
};

export default Payment;
