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
        profile?.user?.isAdmin ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: `/`,
              state: { from: location },
            }}
          />
        )
      }
    ></Route>
  );
};

export default AdminRoute;
