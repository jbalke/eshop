import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { PayPalButton } from 'react-paypal-button-v2';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Link, useParams } from 'react-router-dom';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { formatDataTime, toHTMLDateTime } from '../utils/dates';
import { useUserProfile } from '../hooks/userQueries';
import { toast } from 'react-toastify';

const Order = () => {
  const { id } = useParams();

  const [sdkReady, setSdkReady] = useState(false);
  const [confirmDeliverDate, setConfirmDeliverDate] = useState(false);
  const [deliverDate, setDeliverDate] = useState(toHTMLDateTime(Date.now()));

  const queryClient = useQueryClient();

  const userProfile = useUserProfile();

  const { data, isError, error, isSuccess, isLoading } = useQuery(
    ['order', id],
    ApiService.orders.getOrderDetails(id)
  );

  const payment = useMutation(ApiService.orders.updateOrderToPaid, {
    onSuccess: (data) => {
      toast.success('Payment received, thank you!');
      queryClient.refetchQueries(['order', id]);
    },
    onError: (error) => {
      console.error(
        'Payment submitted via PayPal but was unable to update the order.'
      );
    },
  });

  // optimistic update
  const deliver = useMutation(ApiService.admin.upDateOrderToDelivered, {
    onMutate: async (update) => {
      toast.dismiss();
      await queryClient.cancelQueries(['order', update.id]);

      const previousData = queryClient.getQueryData(['order', update.id]);

      queryClient.setQueryData(['order', update.id], (oldData) => ({
        ...oldData,
        delivered: true,
        deliveredAt: update.deliverDate,
      }));

      return { previousData };
    },
    onSuccess: () => {
      toast.success('Order updated');
    },
    onError: (error, update, context) => {
      toast.error(error.message, { autoClose: false });
      queryClient.setQueryData(['order', id], context.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['order', id]);
    },
  });

  const itemsPrice = data?.orderItems?.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (
      isSuccess &&
      !data.isPaid &&
      userProfile.data?.user?._id === data.user._id
    ) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [isSuccess, data, userProfile]);

  const successPaymentHandler = (paymentResult) => {
    payment.mutate({ id, paymentResult });
  };

  const deliveredHandler = (e) => {
    if (confirmDeliverDate) {
      setConfirmDeliverDate(false);
      deliver.mutate({ id, deliverDate: new Date(deliverDate).getTime() });
    } else {
      setConfirmDeliverDate(true);
    }
  };

  const confirmDeliverDateHandler = (e) => {
    e.preventDefault();

    deliveredHandler();
  };

  return (
    <div className=''>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
        <>
          <h1 className='text-base'>Order {id}</h1>
          <div className='placeorder-layout'>
            <div className='order-layout'>
              <div className='order-address'>
                <h2 className='text-lg text-gray-600'>Shipping</h2>
                <div>
                  <span className='font-bold'>Address: </span>
                  <span>
                    {data.shippingAddress.name}, {data.shippingAddress.address},{' '}
                    {data.shippingAddress.city}, {data.shippingAddress.postCode}
                    , {data.shippingAddress.country}
                  </span>
                </div>
                <div>
                  <span className='font-bold'>Email: </span> {data.user.email}
                </div>
                {data.isDelivered ? (
                  <Message type='success'>
                    Delivered on {formatDataTime(data.deliveredAt)}.
                  </Message>
                ) : (
                  <Message type='warning'>Not Delivered</Message>
                )}
              </div>
              <div className='order-method'>
                <h2 className='text-lg text-gray-600'>Payment Method</h2>
                <div>
                  <span className='font-bold'>Method: </span>
                  {data.paymentMethod}
                </div>
                {data.isPaid ? (
                  <Message type='success'>
                    Paid on {formatDataTime(data.paidAt)}.
                  </Message>
                ) : (
                  <Message type='warning'>Not Paid</Message>
                )}
              </div>
              <div className='order-items text-sm'>
                <h2 className='text-lg text-gray-600'>Order Items</h2>
                {data.orderItems.length === 0 ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <ol>
                    {data.orderItems.map((item, index) => (
                      <li key={index} className='cart-item'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='rounded'
                        />
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                        <div>
                          {item.qty} x ${item.price.toFixed(2)} = $
                          {(item.qty * item.price).toFixed(2)}
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
                  <div>${itemsPrice.toFixed(2)}</div>
                </div>
                <div className='order-summary-item'>
                  <div>Shipping</div>
                  <div>${data.shippingPrice.toFixed(2)}</div>
                </div>
                <div className='order-summary-item'>
                  <div>Tax</div>
                  <div>${data.taxPrice.toFixed(2)}</div>
                </div>
                <div className='order-summary-item'>
                  <div>Total</div>
                  <div>${data.totalPrice.toFixed(2)}</div>
                </div>
              </div>
              {userProfile.data?.user?.isAdmin &&
                data.isPaid &&
                !data.isDelivered && (
                  <button
                    className='btn primary w-full'
                    onClick={deliveredHandler}
                    disabled={deliver.isLoading}
                  >
                    {confirmDeliverDate ? 'confirm date' : 'mark as delivered'}
                  </button>
                )}
              <form
                className={`mt-1 transform transition-transform ${
                  confirmDeliverDate ? 'scale-y-100' : 'scale-y-0'
                }`}
                onSubmit={confirmDeliverDateHandler}
              >
                <input
                  type='datetime-local'
                  className=''
                  value={deliverDate}
                  onChange={(e) => setDeliverDate(e.target.value)}
                />
              </form>
              {!data.isPaid && userProfile.data?.user?._id === data.user._id && (
                <div>
                  {payment.isLoading && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={data.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </div>
              )}
              {payment.isError && (
                <Message type='danger'>{payment.error.message}</Message>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Order;
