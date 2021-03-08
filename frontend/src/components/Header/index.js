import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useUserProfile } from '../../hooks/userQueries';
import SubMenu from './Submenu';
import './header.css';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const closeUserMenu = useCallback(() => setIsUserMenuOpen(false), [
    setIsUserMenuOpen,
  ]);
  const toggleUserMenu = () => setIsUserMenuOpen((isOpen) => !isOpen);

  const dropdownRef = useRef(null);

  const userProfile = useUserProfile();

  const handleUserMenuClick = (e) => {
    e.stopPropagation();
    toggleUserMenu();
  };

  useEffect(() => {
    window.addEventListener('resize', closeUserMenu);
    return () => {
      window.removeEventListener('resize', closeUserMenu);
    };
  }, [closeUserMenu]);

  return (
    <header className='bg-gray-700 text-white'>
      <div className='max-w-screen-lg mx-auto flex justify-between items-center px-3 my-6'>
        <Link to='/' className='uppercase text-xl font-bold tracking-wide'>
          E-Shop
        </Link>
        <nav className='uppercase text-sm'>
          <div className='flex text-sm bg-transparent'>
            <NavLink
              to='/cart'
              className='link link-light font-bold uppercase ml-4'
              activeClassName='text-white'
            >
              <FaShoppingCart className='inline mr-1' />
              cart
            </NavLink>
            {userProfile.data?.user ? (
              <button
                className='link link-light font-bold uppercase dropdown ml-4 p-1'
                onClick={handleUserMenuClick}
                ref={dropdownRef}
                aria-haspopup='true'
                aria-expanded={isUserMenuOpen}
              >
                {userProfile.data.user.name}
              </button>
            ) : (
              <NavLink
                to='/login'
                className='link link-light font-bold uppercase ml-4'
                activeClassName='text-white'
              >
                <FaUser className='inline mr-1' />
                sign in
              </NavLink>
            )}
          </div>
        </nav>
      </div>
      <SubMenu
        isOpen={isUserMenuOpen}
        closeSubMenu={closeUserMenu}
        btnRef={dropdownRef}
      >
        <li>
          <Link to='/profile' role='menuitem'>
            Profile
          </Link>
        </li>
        {['admin', 'manager'].some(
          (role) => role === userProfile.data?.user?.role
        ) && (
          <>
            <li className='admin-menu-item'>
              <Link to='/admin/user-list' role='menuitem'>
                Users
              </Link>
            </li>
            <li className='admin-menu-item'>
              <Link to='/admin/product-list' role='menuitem'>
                Products
              </Link>
            </li>
            <li className='admin-menu-item'>
              <Link to='/admin/stock-list' role='menuitem'>
                Stock
              </Link>
            </li>
            <li className='admin-menu-item'>
              <Link to='/admin/undelivered-order-list' role='menuitem'>
                Undelivered Orders
              </Link>
            </li>
          </>
        )}
        <li>
          <Link to='/logout' role='menuitem'>
            Logout
          </Link>
        </li>
      </SubMenu>
    </header>
  );
};

export default Header;
