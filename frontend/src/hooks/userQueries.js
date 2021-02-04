import { useQuery } from 'react-query';
import ApiService from '../api/ApiService';

export const useUserProfile = () => {
  return useQuery('user', ApiService.users.userProfile, {
    retry: false,
    initialData: { user: null },
    staleTime: 0,
  });
};

export const useAuthPing = () => {
  return useQuery('authPing', ApiService.users.authPing, {
    retry: false,
    staleTime: 15 * 60 * 1000,
  });
};
