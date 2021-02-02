import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import ApiService from '../api/ApiService';
import { FaShoppingCart, FaUser } from 'react-icons/fa';

const Header = () => {
  const { isSuccess } = useQuery(
    'user',
    ApiService.users.userProfile,
    { retry: 1, staleTime: 15 * 60 * 1000 } //staleTime === JWT expiry
  );

  return (
    <header className='bg-gray-700 text-white'>
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
            {isSuccess ? (
              <NavLink
                to='/logout'
                className='hover:text-white transition-colors flex items-center ml-4'
                activeClassName='text-white'
              >
                <FaUser className='inline mr-1' />
                sign out
              </NavLink>
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
    </header>
  );
};

export default Header;
