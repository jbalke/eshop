import { mainNav } from '../data/navigation';
import { NavLink, Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='bg-gray-700 text-white'>
      <div className='max-w-screen-lg mx-auto flex justify-between items-center px-2 my-6'>
        <Link to='/' className='uppercase text-xl font-bold tracking-wide'>
          E-Shop
        </Link>
        <nav className='main-nav uppercase text-sm font-bold text-gray-400'>
          <div className='flex text-sm bg-transparent uppercase'>
            {mainNav.map((link, index) => {
              const { name, url, Icon } = link;
              return (
                <NavLink
                  key={index}
                  to={url}
                  className='hover:text-white transition-colors flex items-center ml-4'
                  activeClassName='text-white'
                >
                  <Icon className='inline mr-1' />
                  {name}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
