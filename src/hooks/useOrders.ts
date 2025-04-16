
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order } from '@/types/order';

export const useOrders = (userId: string) => {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: async () => {
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = orders.map((order): Order => ({
        id: order.id,
        userId: order.user_id,
        totalAmount: order.total_amount,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderStatus: order.order_status,
        shippingAddress: order.shipping_address,
        createdAt: order.created_at,
        status: order.order_status,
        trackingNumber: order.tracking_id,
        updatedAt: order.updated_at,
        estimatedDelivery: order.estimated_delivery,
        items: order.items.map(item => ({
          productId: item.product_id,
          productName: item.product_name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image
        }))
      }));

      return formattedOrders;
    },
    enabled: !!userId
  });
};
