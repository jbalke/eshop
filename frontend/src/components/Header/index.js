import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useUIContext } from '../../ui-context';
import { useUserProfile } from '../../hooks/userQueries';
import SearchBox from '../SearchBox';
import SubMenu from './Submenu';
import './header.css';

const Header = () => {
  const { toggleUserMenu, closeUserMenu, isUserMenuOpen } = useUIContext();

  const [rect, setRect] = useState(null);
  const dropdownRef = useRef(null);

  const userProfile = useUserProfile();

  const handleUserMenuClick = (e) => {
    e.stopPropagation();
    setRect(dropdownRef.current.getBoundingClientRect());
    toggleUserMenu();
  };

  const handleUserMenu = (e) => {
    if (!e.target.dataset.userMenu) {
      closeUserMenu();
    }
  };

  useEffect(() => {
    window.addEventListener('resize', closeUserMenu);
    return () => {
      window.removeEventListener('resize', closeUserMenu);
    };
  }, [closeUserMenu]);

  return (
    <header className='bg-gray-700 text-white' onClick={handleUserMenu}>
      <div className='max-w-screen-lg mx-auto flex justify-between items-center px-3 my-6'>
        <Link to='/' className='uppercase text-xl font-bold tracking-wide'>
          E-Shop
        </Link>
        <SearchBox />
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
      <SubMenu location={rect} isOpen={isUserMenuOpen}>
        <li>
          <Link to='/profile' role='menuitem'>
            Profile
          </Link>
        </li>
        {['admin', 'manager'].some(
          (role) => role === userProfile.data?.user?.role
        ) && (
          <>
            <li className='admin-menu-item' role='menuitem'>
              <Link to='/admin/user-list'>Users</Link>
            </li>
            <li className='admin-menu-item' role='menuitem'>
              <Link to='/admin/product-list'>Products</Link>
            </li>
            <li className='admin-menu-item' role='menuitem'>
              <Link to='/admin/stock-list'>Stock</Link>
            </li>
            <li className='admin-menu-item' role='menuitem'>
              <Link to='/admin/undelivered-order-list'>Undelivered Orders</Link>
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
