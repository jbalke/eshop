import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

const Paginate = ({
  page = 1,
  pages = 1,
  keyword = '',
  limit,
  isPreviousData,
}) => {
  const history = useHistory();
  const location = useLocation();

  if (pages <= 1) return null;

  const prevPageHandler = () => {
    history.push(
      `${location.pathname}?keyword=${keyword}&limit=${limit}&page=${Math.max(
        1,
        page - 1
      )}`
    );
  };

  const nextPageHandler = () => {
    if (page < pages) {
      history.push(
        `${location.pathname}?keyword=${keyword}&limit=${limit}&page=${
          page + 1
        }`
      );
    }
  };

  return (
    <div className='flex justify-between items-center w-full'>
      <button
        onClick={prevPageHandler}
        className='btn small primary'
        disabled={page <= 1}
      >
        &larr;
      </button>
      <div>
        {Array.from({ length: pages }, (val, index) => index + 1).map(
          (pageNumber, index) => (
            <Link
              key={index}
              to={`${location.pathname}?keyword=${keyword}&page=${pageNumber}`}
              className={`btn ${page === pageNumber ? 'primary' : ''}`}
            >
              {pageNumber}
            </Link>
          )
        )}
      </div>
      <button
        onClick={nextPageHandler}
        className='btn small primary'
        disabled={isPreviousData || page >= pages}
      >
        &rarr;
      </button>
    </div>
  );
};

export default Paginate;
