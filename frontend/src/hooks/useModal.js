import React, { useState } from 'react';
import ReactDOM from 'react-dom';

export const useModal = (modalRoot) => {
  const [showModal, setShowModal] = useState(false);
  const [isActionConfirmed, setIsActionConfirmed] = useState(false);

  return {
    Modal({ children }) {
      if (!showModal) return null;

      return ReactDOM.createPortal(
        <>
          <div className='fixed top-0 left-0 w-screen h-screen bg-black opacity-95'></div>
          <div className='fixed top-0 left-0 w-screen h-screen flex justify-center items-center'>
            <div className='bg-white p-4 border-2 text-center'>
              {children}
              <div className='flex justify-evenly items-center p-2 mt-4'>
                <button
                  type='button'
                  onClick={() => {
                    setIsActionConfirmed(true);
                    setShowModal(false);
                  }}
                  className='btn primary'
                >
                  OK
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setShowModal(false);
                  }}
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
    },
    setShowModal,
    isActionConfirmed,
    setIsActionConfirmed,
  };
};
