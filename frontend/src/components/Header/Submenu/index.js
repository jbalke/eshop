import React, { useEffect, useRef } from 'react';
import './submenu.css';

const SubMenu = ({ isOpen, closeSubMenu, children, btnRef }) => {
  const dropDownRef = useRef(null);

  const location = btnRef.current?.getBoundingClientRect();

  const handleClickOutside = (e) => {
    if (
      e.target !== btnRef.current &&
      !dropDownRef.current?.contains(e.target)
    ) {
      closeSubMenu();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

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
      ref={dropDownRef}
    >
      <ul onClick={closeSubMenu} role='menu'>
        {children}
      </ul>
    </div>
  );
};

export default SubMenu;
