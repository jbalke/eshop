import React from 'react';
import { useQueryClient } from 'react-query';
import { Redirect, Route } from 'react-router-dom';

const AdminRoute = ({ children, ...rest }) => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData('myProfile');

  return (
    <Route
      {...rest}
      render={({ location }) =>
        ['admin', 'manager'].some((role) => role === profile?.user?.role) ? (
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

export default AdminRoute;
