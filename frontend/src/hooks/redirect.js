import React from 'react';
import { useQueryClient } from 'react-query';
import { useHistory, useLocation } from 'react-router-dom';

export const useLoginIfNotAuthenticated = (redirectTo) => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const location = useLocation();

  React.useEffect(() => {
    const userProfile = queryClient.getQueryData('userProfile');
    if (!userProfile?.user) {
      history.push(`/login?redirect=${location.pathname}`);
    }
  });
};
