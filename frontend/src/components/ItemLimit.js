import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

const ItemLimit = ({ keyword = '', limit = 25, step = 12 }) => {
  const history = useHistory();
  const location = useLocation();

  return (
    <div className='flex items-end flex-row-reverse my-4'>
      <div className='flex items-center'>
        <label htmlFor='displayLimit'>items / page</label>
        <select
          name='displayLimit'
          id='displayLimit'
          onChange={(e) =>
            history.push(
              `${location.pathname}?keyword=${keyword}&limit=${
                e.target.value
              }&page=${1}`
            )
          }
          value={limit}
          className='ml-1 text-sm'
        >
          <option value='2'>2</option>
          {Array.from({ length: 4 }, (val, index) => (index + 1) * step).map(
            (val, i) => (
              <option key={i} value={val}>
                {val}
              </option>
            )
          )}
          <option value='999'>All</option>
        </select>
      </div>
    </div>
  );
};

export default ItemLimit;
