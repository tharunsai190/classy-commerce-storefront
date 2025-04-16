
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, PaymentMethod, OrderStatus, Address } from '@/types/order';

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
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedOrders = orders.map((order): Order => ({
        id: order.id,
        userId: order.user_id,
        totalAmount: order.total_amount,
        paymentMethod: order.payment_method as PaymentMethod,
        paymentStatus: order.payment_status as 'pending' | 'paid' | 'failed',
        orderStatus: order.order_status as 'processing' | 'shipped' | 'delivered' | 'cancelled',
        shippingAddress: order.shipping_address as unknown as Address,
        createdAt: order.created_at,
        status: order.order_status as OrderStatus,
        trackingNumber: order.tracking_id,
        updatedAt: order.updated_at,
        estimatedDelivery: order.estimated_delivery,
        address: order.shipping_address as unknown as Address,
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
