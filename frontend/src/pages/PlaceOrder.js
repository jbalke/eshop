import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { clearCart } from '../actions/cartActions';
import ApiService from '../api/ApiService';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import { sleep } from '../utils/sleep';

const PlaceOrder = () => {
  const [isOrderSent, setIsOrderSent] = useState(false);
  const cart = useSelector((state) => state.cart);
  const history = useHistory();
  const dispatch = useDispatch();

  cart.itemsPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 100;
  cart.taxPrice = Math.round(cart.itemsPrice * 15) / 100;
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  const { data, isError, error, isSuccess, mutate } = useMutation(
    ApiService.orders.createOrder({
      orderItems: cart.cartItems,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      itemsPrice: cart.itemsPrice,
      taxPrice: cart.taxPrice,
      shippingPrice: cart.shippingPrice,
    }),
    {
      onSuccess: (data) => {
        dispatch(clearCart);
      },
      onError: () => {
        setIsOrderSent(false);
      },
    }
  );

  const placeOrderHandler = (e) => {
    setIsOrderSent(true);
    mutate();
  };

  useEffect(() => {
    if (isSuccess) {
      sleep(2).then(() => history.push(`/order/${data._id}`));
    }
  }, [history, isSuccess, data]);

  return (
    <>
      <div className='sm:w-full md:max-w-md mx-auto'>
        <CheckoutSteps step1 step2 step3 step4 />
      </div>
      <h1 className='sr-only'>Place Order</h1>
      <div className='placeorder-layout'>
        <div className='order-layout'>
          <div className='order-address'>
            <h2 className='text-lg text-gray-600'>Shipping</h2>
            <span>Address: </span>
            <span>
              {cart.shippingAddress.name}, {cart.shippingAddress.address},{' '}
              {cart.shippingAddress.city}, {cart.shippingAddress.postCode},{' '}
              {cart.shippingAddress.country}
            </span>
          </div>
          <div className='order-method'>
            <h2 className='text-lg text-gray-600'>Payment Method</h2>
            <span>Method: </span>
            <span>{cart.paymentMethod}</span>
          </div>
          <div className='order-items text-sm'>
            <h2 className='text-lg text-gray-600'>Order Items</h2>
            {cart.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <ol>
                {cart.cartItems.map((item, index) => (
                  <li key={index} className='cart-item'>
                    <img src={item.image} alt={item.name} className='rounded' />
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <div>
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
        <div className='order-summary'>
          <h2 className='text-lg text-gray-600'>Order Summary</h2>
          <div className='order-summary-items'>
            <div className='order-summary-item'>
              <div>Items</div>
              <div>${cart.itemsPrice.toFixed(2)}</div>
            </div>
            <div className='order-summary-item'>
              <div>Shipping</div>
              <div>${cart.shippingPrice.toFixed(2)}</div>
            </div>
            <div className='order-summary-item'>
              <div>Tax</div>
              <div>${cart.taxPrice.toFixed(2)}</div>
            </div>
            <div className='order-summary-item'>
              <div>Total</div>
              <div>${cart.totalPrice.toFixed(2)}</div>
            </div>
          </div>
          <button
            type='button'
            className='btn primary w-full mt-4'
            onClick={placeOrderHandler}
            disabled={isOrderSent || !cart.cartItems?.length > 0}
          >
            place order
          </button>
          {isError && <Message type='danger'>{error.message}</Message>}
          {isSuccess && <Message type='success'>Order ref: {data._id}</Message>}
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
