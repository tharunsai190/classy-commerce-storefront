
import { useQuery } from '@tanstack/react-query';
import { getUserOrders } from '@/data/orders';
import { Order } from '@/types/order';

export const useOrders = (userId: string) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async (): Promise<Order[]> => {
      // Add a small artificial delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Get orders from mock data
      const orders = getUserOrders(userId);
      return orders;
    },
    enabled: !!userId
  });
};
