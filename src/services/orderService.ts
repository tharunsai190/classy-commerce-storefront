
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types/order';

export const createOrder = async (order: Order) => {
  // Convert the address to JSON format for storage
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: order.userId,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      shipping_address: order.shippingAddress as any,
      tracking_id: order.trackingNumber,
      estimated_delivery: order.estimatedDelivery
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = order.items.map((item: OrderItem) => ({
    order_id: newOrder.id,
    product_id: item.productId,
    product_name: item.productName,
    price: item.price,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    image: item.image
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return newOrder;
};
