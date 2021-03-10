import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { clearCart } from '../actions/cartActions';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Progress from '../components/Progress';
import { GBP } from '../config/currency';

const PlaceOrder = () => {
  const cart = useSelector((state) => state.cart);
  const [order, setOrder] = useState(cart);
  const [isOrderSent, setIsOrderSent] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const ratesInfo = useQuery('rates', ApiService.orders.getRates);

  const { data, isError, error, isSuccess, mutate } = useMutation(
    ApiService.orders.createOrder,
    {
      onSuccess: (data) => {
        toast.success('Order recieved!');
        dispatch(clearCart);
      },
      onError: () => {
        toast.error(`Order failed, please try again.`, { autoClose: 5000 });
        setIsOrderSent(false);
      },
    }
  );

  const placeOrderHandler = (e) => {
    setIsOrderSent(true);
    mutate({
      orderItems: order.cartItems,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
    });
  };

  useEffect(() => {
    if (ratesInfo.isSuccess) {
      const { taxRate, freeShippingThreshold } = ratesInfo.data;
      setOrder((cart) => {
        const itemsPrice = cart.cartItems.reduce(
          (acc, item) => acc + item.price * item.qty,
          0
        );
        const shippingPrice = itemsPrice > freeShippingThreshold ? 0 : 10000;
        const taxPrice = (itemsPrice * taxRate) / 100;
        const totalPrice = GBP(itemsPrice + shippingPrice + taxPrice).intValue;
        return {
          ...cart,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        };
      });
    }
  }, [ratesInfo.isSuccess, ratesInfo.data]);

  useEffect(() => {
    if (isSuccess) {
      history.push(`/order/${data._id}`);
    }
  }, [history, isSuccess, data]);

  if (ratesInfo.isError) {
    return <Message type='danger'>{error.message}</Message>;
  }
  if (ratesInfo.isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Progress />
      <h1 className='sr-only'>Place Order</h1>
      <div className='placeorder-layout'>
        <div className='order-layout'>
          <div className='order-address'>
            <h2 className='text-lg text-gray-600'>Shipping</h2>
            <span>Address: </span>
            <span>
              {order.shippingAddress.name}, {order.shippingAddress.address},{' '}
              {order.shippingAddress.city}, {order.shippingAddress.postCode},{' '}
              {order.shippingAddress.country}
            </span>
          </div>
          <div className='order-method'>
            <h2 className='text-lg text-gray-600'>Payment Method</h2>
            <span>Method: </span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className='order-items text-sm'>
            <h2 className='text-lg text-gray-600'>Order Items</h2>
            {order.cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <ol>
                {order.cartItems.map((item, index) => (
                  <li key={index} className='cart-item'>
                    <img src={item.image} alt={item.name} className='rounded' />
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <div>
                      {item.qty} x {`${GBP(item.price).format()}`} ={' '}
                      {`${GBP(item.qty * item.price).format()}`}
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
              <div>{`${GBP(order.itemsPrice).format()}`}</div>
            </div>
            <div className='order-summary-item'>
              <div>Shipping</div>
              <div>{`${GBP(order.shippingPrice).format()}`}</div>
            </div>
            <div className='order-summary-item'>
              <div>VAT</div>
              <div>
                {`${GBP(order.taxPrice).format()}`} ({ratesInfo.data.taxRate}
                %)
              </div>
            </div>
            <div className='order-summary-item'>
              <div>Total</div>
              <div>{`${GBP(order.totalPrice).format()}`}</div>
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
        </div>
      </div>
    </>
  );
};

export default PlaceOrder;
