import React from 'react';
import { NavLink } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className='mb-8'>
      <ol className='flex justify-around'>
        <li>
          {step1 ? (
            <NavLink
              to='/login'
              className='link link-dark'
              activeClassName='text-gray-900'
            >
              Sign In
            </NavLink>
          ) : (
            <div className='link link-dark disabled'>Sign In</div>
          )}
        </li>
        <li>
          {step2 ? (
            <NavLink
              to='/shipping'
              className='link link-dark'
              activeClassName='text-gray-900'
            >
              Shipping
            </NavLink>
          ) : (
            <div className='link link-dark disabled'>Shipping</div>
          )}
        </li>
        <li>
          {step3 ? (
            <NavLink
              to='/payment'
              className='link link-dark'
              activeClassName='text-gray-900'
            >
              Payment
            </NavLink>
          ) : (
            <div className='link link-dark disabled'>Payment</div>
          )}
        </li>
        <li>
          {step4 ? (
            <NavLink
              to='/placeorder'
              className='link link-dark'
              activeClassName='text-gray-900'
            >
              Place Order
            </NavLink>
          ) : (
            <div className='link link-dark disabled'>Place Order</div>
          )}
        </li>
      </ol>
    </nav>
  );
};

export default CheckoutSteps;
