import React, { useEffect } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useQuery } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import ApiService from '../api/ApiService';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { GBP } from '../config/currency';
import { useQueryString } from '../hooks/url';

const Cart = () => {
  const { id: productId } = useParams();
  const history = useHistory();

  const searchParams = useQueryString();
  const qty = parseInt(searchParams.get('qty'));
  const validQty = Number.isNaN(qty) ? 1 : qty;

  const { cartItems } = useSelector((state) => state.cart);

  const { isError, data, isLoading } = useQuery(
    ['product', productId],
    ApiService.products.getProduct(productId),
    { enabled: !!productId }
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (productId && data) {
      dispatch(addToCart({ ...data, qty: validQty }));
    }
  }, [productId, dispatch, data, validQty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    history.push(`/shipping`);
  };

  return (
    <section className=''>
      <h1>Shopping Cart</h1>
      {isLoading ? (
        <Loader />
      ) : cartItems.length === 0 ? (
        <Message type='info'>
          Your cart is empty - <Link to='/'>Go Back</Link>
        </Message>
      ) : (
        <>
          <Meta title='E-Shop | Cart' />
          {isError && (
            <Message type='danger'>
              Unable to add item to your cart, please try again later.
            </Message>
          )}
          <div className='cart-layout'>
            <div className='cart-items'>
              {cartItems.map((item, i) => (
                <div key={i} className='cart-item'>
                  <img src={item.image} alt={item.name} className='rounded' />
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                  <div>{`${GBP(item.price).format()}`}</div>
                  <select
                    name='qty'
                    id='qty'
                    className='qty-select border py-2 px-4'
                    value={item.qty}
                    onChange={(e) =>
                      dispatch(
                        addToCart({ ...item, qty: Number(e.target.value) })
                      )
                    }
                  >
                    {Array.from(
                      { length: item.countInStock },
                      (v, i) => i + 1
                    ).map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <button
                    className='remove-btn btn border'
                    type='button'
                    onClick={() => removeFromCartHandler(item.product)}
                    title='remove item'
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              ))}
            </div>
            <div className='cart-info'>
              <div className='text-right'>
                <h2>
                  Subtotal{' '}
                  <span className='text-sm'>
                    ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)
                  </span>
                </h2>
                <span className='border-0 border-b border-gray-800 text-lg font-semibold tracking-wider'>
                  {GBP(
                    cartItems.reduce(
                      (acc, item) => acc + item.price * item.qty,
                      0
                    )
                  ).format()}
                </span>
              </div>
              <button
                type='button'
                className='btn primary'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </button>
              <Link to={'/'} className='btn secondary'>
                continue shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;
