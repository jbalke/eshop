import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useQuerySearchParams = (globalLimit, setGlobalLimit) => {
  const location = useLocation();

  const queryString = new URLSearchParams(location.search);
  const queryPage = Number(queryString.get('page')) || 1;
  const pageNumber = Number.isNaN(queryPage) ? 1 : queryPage;
  const queryKeyword = queryString.get('keyword') || '';

  const [limit, setLimit] = useState(12);
  const queryLimit = queryString.get('limit') || globalLimit || limit;

  const [page, setPage] = useState(pageNumber);
  const [keyword, setKeyword] = useState(queryKeyword);

  useEffect(() => {
    setPage(pageNumber);
    setKeyword(queryKeyword);
    setGlobalLimit ? setGlobalLimit(queryLimit) : setLimit(queryLimit);
  }, [pageNumber, queryKeyword, queryLimit, setLimit, setGlobalLimit]);

  return {
    limit: globalLimit ? globalLimit : limit,
    keyword,
    page,
  };
};
