
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types/order';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (order: Order) => {
  // Generate a UUID for user_id if it's not in proper UUID format
  let userId = order.userId;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
    userId = uuidv4(); // Generate a valid UUID
  }

  // Convert the address to JSON format for storage
  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
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
