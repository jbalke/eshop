import React, { useState, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useGlobalContext } from '../context';
import { useUserProfile, useAuthPing } from '../hooks/userQueries';

const Header = () => {
  const { toggleUserMenu, closeUserMenu, isUserMenuOpen } = useGlobalContext();

  const [rect, setRect] = useState(null);
  const dropdownRef = useRef(null);

  const authPing = useAuthPing();

  const handleUserMenuClick = (e) => {
    e.stopPropagation();
    setRect(e.target.getBoundingClientRect());
    toggleUserMenu();
  };

  const handleUserMenu = (e) => {
    if (!e.target.dataset.userMenu) {
      closeUserMenu();
    }
  };

  const SubMenu = ({ location }) => {
    return (
      <div
        className='absolute bg-gray-100 text-black border shadow-md py-4 px-8 w-40'
        style={{ left: location.left, top: location.bottom + 15, zIndex: 999 }}
        data-user-menu
      >
        <ul onClick={closeUserMenu}>
          <li>Profile</li>
          <li>
            <Link to='/logout'>Logout</Link>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <header className='bg-gray-700 text-white' onClick={handleUserMenu}>
      <div className='max-w-screen-lg mx-auto flex justify-between items-center px-2 my-6'>
        <Link to='/' className='uppercase text-xl font-bold tracking-wide'>
          E-Shop
        </Link>
        <nav className='main-nav uppercase text-sm font-bold text-gray-400'>
          <div className='flex text-sm bg-transparent uppercase'>
            <NavLink
              to='/cart'
              className='hover:text-white transition-colors flex items-center ml-4'
              activeClassName='text-white'
            >
              <FaShoppingCart className='inline mr-1' />
              cart
            </NavLink>
            {authPing.data?.user?.name ? (
              <button
                className='link dropdown uppercase hover:text-white transition-colors flex items-center ml-4'
                onClick={handleUserMenuClick}
                ref={dropdownRef}
              >
                {authPing.data.user.name}
              </button>
            ) : (
              <NavLink
                to='/login'
                className='hover:text-white transition-colors flex items-center ml-4'
                activeClassName='text-white'
              >
                <FaUser className='inline mr-1' />
                sign in
              </NavLink>
            )}
          </div>
        </nav>
      </div>
      {isUserMenuOpen && <SubMenu location={rect} />}
    </header>
  );
};

export default Header;
