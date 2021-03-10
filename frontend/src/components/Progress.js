import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Progress.css';

const Progress = () => {
  const location = useLocation();

  if (
    !['/shipping', '/payment', '/placeorder'].some(
      (path) => path === location.pathname
    )
  ) {
    return null;
  }

  const isFirstStep = location.pathname === '/login';
  const isSecondStep = location.pathname === '/shipping';
  const isThirdStep = location.pathname === '/payment';
  const isForthStep = location.pathname === '/placeorder';

  return (
    <div className='steps'>
      <div className={`step ${isFirstStep ? 'active' : ''}`}>
        <div>1</div>
        <div>
          {isSecondStep || isThirdStep || isForthStep ? (
            <Link to='/'>Sign In</Link>
          ) : (
            'Sign In'
          )}
        </div>
      </div>
      <div className={`step ${isSecondStep ? 'active' : ''}`}>
        <div>2</div>
        <div>
          {isThirdStep || isForthStep ? (
            <Link to='/shipping'>Shipping</Link>
          ) : (
            'Shipping'
          )}
        </div>
      </div>
      <div className={`step ${isThirdStep ? 'active' : ''}`}>
        <div>3</div>
        <div>
          {isForthStep ? <Link to='/payment'>Payment</Link> : 'Payment'}
        </div>
      </div>
      <div className={`step ${isForthStep ? 'active' : ''}`}>
        <div>4</div>
        <div>Payment</div>
      </div>
    </div>
  );
};

export default Progress;
