import { useQuery } from 'react-query';
import ApiService from '../api/ApiService';

export const useUserProfile = () => {
  return useQuery('user', ApiService.users.userProfile);
};

export const useAuthPing = () => {
  return useQuery('userPing', ApiService.users.authPing, {
    retry: false,
    staleTime: 15 * 60 * 1000,
    placeholderData: { user: null },
  });
};
