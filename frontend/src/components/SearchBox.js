import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');

  const history = useHistory();
  const location = useLocation();

  const onClearHandler = () => {
    setKeyword('');
    if (location.search) {
      history.push(`${location.pathname}`);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const search = keyword.trim();
    if (search) {
      history.push(`${location.pathname}?keyword=${search}&page=1`);
    } else {
      history.push(`${location.pathname}`);
    }
  };

  return (
    <div className='flex justify-center my-4'>
      <form
        onSubmit={submitHandler}
        className='inline-flex border rounded-md focus-within:ring-4 focus-within:ring-green-500 focus-within:ring-opacity-50 w-56 sm:w-1/3'
      >
        <div className='flex items-center bg-gray-100 px-2 w-full'>
          <input
            type='text'
            name='searchTerm'
            id='searchTerm'
            value={keyword}
            placeholder='Search..'
            className='searchinput mr-1 text-black bg-gray-100 p-1 outline-none flex-grow'
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            type='button'
            onClick={onClearHandler}
            className='p-1'
            title='clear search'
          >
            <FaTimes className='text-gray-400' />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBox;
