import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children, onConfirm, onCancel, modalRoot, isShow }) => {
  if (!isShow) return null;

  return ReactDOM.createPortal(
    <>
      <div className='fixed top-0 left-0 w-screen h-screen bg-black opacity-95'></div>
      <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center'>
        <div className='bg-white p-4 border-2 text-center'>
          {children}
          <div className='flex justify-evenly items-center p-2 mt-4'>
            <button type='button' onClick={onConfirm} className='btn primary'>
              OK
            </button>
            <button
              type='button'
              onClick={onCancel}
              className='btn secondary ml-4'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>,
    modalRoot
  );
};

export default Modal;
