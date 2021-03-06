import React from 'react';
import { useQueryClient } from 'react-query';
import { Redirect, Route } from 'react-router-dom';

const PrivateRoute = ({ children, ...rest }) => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData('myProfile');

  return (
    <Route
      {...rest}
      render={({ location }) =>
        profile?.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: `/login`,
              state: { from: location },
            }}
          />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
