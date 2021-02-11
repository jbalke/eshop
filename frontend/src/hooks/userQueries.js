import { useQuery } from 'react-query';
import ApiService from '../api/ApiService';

export const useUserProfile = () => {
  return useQuery('userProfile', ApiService.users.getUserProfile, {
    staleTime: 15 * 60 * 1000,
    retry: false,
  });
};

export const useUserDetails = (id) => {
  return useQuery(['user', id], ApiService.users.getUserDetails(id));
};

export const useGetMyOrders = () => {
  return useQuery('userOrders', ApiService.orders.getMyOrders);
};
