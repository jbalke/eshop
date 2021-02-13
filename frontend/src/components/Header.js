import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useUIContext } from '../ui-context';
import { useUserProfile } from '../hooks/userQueries';

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

  const SubMenu = ({ location }) => {
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
        <ul onClick={closeUserMenu}>
          <li>
            <Link to='/profile'>Profile</Link>
          </li>
          {userProfile?.data?.user?.isAdmin && (
            <>
              <li className='border-t'>
                <Link to='/admin/user-list'>Users</Link>
              </li>
              <li>
                <Link to='/admin/order-list'>Orders</Link>
              </li>
              <li className='border-b'>
                <Link to='/admin/product-list'>Products</Link>
              </li>
            </>
          )}
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
        <nav className='main-nav uppercase text-sm'>
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
      {isUserMenuOpen && <SubMenu location={rect} />}
    </header>
  );
};

export default Header;
