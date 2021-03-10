import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { savePaymentMethod } from '../actions/cartActions';
import Progress from '../components/Progress';

const Payment = () => {
  const history = useHistory();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod: defaultPaymentMethod } = cart;

  if (!shippingAddress) {
    history.push('/shipping');
  }

  const { register, handleSubmit } = useForm({
    defaultValues: { paymentMethod: defaultPaymentMethod || 'PayPal' },
  });

  const dispatch = useDispatch();

  const onSubmit = (data) => {
    dispatch(savePaymentMethod(data.paymentMethod));
    history.push('/placeorder');
  };

  return (
    <>
      <Progress />
      <div className='sm:w-full md:max-w-md mx-auto'>
        <h1>Payment Method</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 className='text-xl text-gray-600 font-semibold capitalize'>
            Select Method
          </h2>
          <section className='form-payment'>
            <input
              name='paymentMethod'
              type='radio'
              id='PayPal'
              value='PayPal'
              ref={register}
            />
            <label htmlFor='Paypal'>PayPal or Credit Card</label>
          </section>
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
    </>
  );
};

export default Payment;
