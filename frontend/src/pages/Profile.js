import React, { useEffect } from 'react';
import ApiService from '../api/ApiService';
import { useQuery } from 'react-query';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useHistory, useLocation } from 'react-router-dom';
import { sleep } from '../utils/sleep';

const Profile = () => {
  const history = useHistory();
  const location = useLocation();
  const { isError, error, data, isLoading } = useQuery(
    'user',
    ApiService.users.userProfile,
    { retry: false }
  );

  useEffect(() => {
    if (isError) {
      sleep(2).then(() => {
        history.replace(`/login?redirect=${location.pathname}`);
      });
    }
  }, [isError, location, history]);

  return (
    <div>
      <h1>Profile</h1>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message type='danger'>{error.message}</Message>
      ) : (
        <Message type='success'>{`Profile for user ${data.name}`}</Message>
      )}
    </div>
  );
};

export default Profile;
