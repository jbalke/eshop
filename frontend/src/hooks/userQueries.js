import { useQuery, useQueryClient } from 'react-query';
import ApiService from '../api/ApiService';

export const useUserProfile = () => {
  const queryClient = useQueryClient();

  return useQuery('myProfile', ApiService.users.getUserProfile, {
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    onError: (error) => {
      queryClient.setQueryData('myProfile', () => ({ user: null }));
    },
  });
};

export const useGetMyOrders = () => {
  return useQuery('myOrders', ApiService.orders.getMyOrders);
};
