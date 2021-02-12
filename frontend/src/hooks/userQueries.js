import { useQuery } from 'react-query';
import ApiService from '../api/ApiService';

export const useUserProfile = () => {
  return useQuery('myProfile', ApiService.users.getUserProfile, {
    staleTime: 0,
    retry: false,
  });
};

export const useUserDetails = (id) => {
  return useQuery(['userDetails', id], ApiService.admin.getUserDetails(id));
};

export const useGetMyOrders = () => {
  return useQuery('myOrders', ApiService.orders.getMyOrders);
};
