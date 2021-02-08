import { useQuery } from 'react-query';
import ApiService from '../api/ApiService';

export const useUserProfile = () => {
  return useQuery('userProfile', ApiService.users.getUserProfile, {
    staleTime: Infinity,
  });
};

export const useUserDetails = (id) => {
  return useQuery(['user', id], ApiService.users.getUserDetails(id));
};
