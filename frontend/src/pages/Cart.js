import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import { Link } from 'react-router-dom';
import { addToCart } from '../actions/cartActions';
import { FaRegTrashAlt } from 'react-icons/fa';

const Cart = ({ match, location, history }) => {
  const productId = match.params.id;

  const qty = location.search ? Number(location.search.split('=')[1]) : 1;
  const { cartItems } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (Id) => {
    dispatch();
  };

  const checkoutHandler = () => {
    history.push(`/login?redirect=shipping`);
  };

  return (
    <section className=''>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <Message type='info'>
          Your cart is empty - <Link to='/'>Go Back</Link>
        </Message>
      ) : (
        <div className='cart-layout'>
          <div className='cart-items'>
            {cartItems.map((item) => (
              <div key={item.product} className='cart-item'>
                <img src={item.image} alt={item.name} className='rounded' />
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <div>${item.price}</div>
                <select
                  name='qty'
                  id='qty'
                  className='border py-2 px-4'
                  value={item.qty}
                  onChange={(e) =>
                    dispatch(addToCart(item.product, Number(e.target.value)))
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
                  className=''
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
            <div>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}{' '}
                items)
              </h2>
              $
              {cartItems
                .reduce((acc, item) => acc + item.price * item.qty, 0)
                .toFixed(2)}
            </div>
            <button
              type='button'
              className='btn'
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Cart;
