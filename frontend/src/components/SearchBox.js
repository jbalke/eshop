import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');

  const history = useHistory();

  const onClearHandler = () => {
    setKeyword('');
    history.push('/');
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const search = keyword.trim();
    if (search) {
      history.push(`/search/${search}`);
    } else {
      history.push('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className='hidden md:inline-flex'>
      <div className='flex items-center bg-gray-100 px-2 mr-1 md:mr-2'>
        <input
          type='text'
          name='searchTerm'
          id='searchTerm'
          value={keyword}
          placeholder='Search products...'
          className='searchinput mr-1 text-black bg-gray-100 p-2'
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button type='button' onClick={onClearHandler} className='p-1'>
          <FaTimes className='text-gray-400' />
        </button>
      </div>
      <button
        type='submit'
        className='btn rounded text-green-600 ring-2 ring-green-600 ring-inset hover:bg-green-600 hover:text-white'
      >
        Search
      </button>
    </form>
  );
};

export default SearchBox;
