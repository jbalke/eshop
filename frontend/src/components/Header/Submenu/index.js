import React from 'react';
import { useUIContext } from '../../../ui-context';
import './submenu.css';

const SubMenu = ({ location, isOpen, children }) => {
  const { closeUserMenu } = useUIContext();

  if (!isOpen) return null;

  return (
    <div
      className='sub-menu absolute bg-gray-100 text-black border shadow-md sm:w-32 md:w-48'
      style={{
        left: location.left,
        top: location.bottom + 15,
        zIndex: 999,
      }}
      data-user-menu
    >
      <ul onClick={closeUserMenu} role='menu'>
        {children}
      </ul>
    </div>
  );
};

export default SubMenu;
