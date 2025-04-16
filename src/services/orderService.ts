
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types/order';
import { v4 as uuidv4 } from 'uuid';

export const createOrder = async (order: Order) => {
  if (!order.userId) {
    throw new Error('User ID is required to create an order');
  }

  // Convert shipping address to a plain object to satisfy Json type requirements
  const shippingAddressJson = { ...order.shippingAddress };

  const { data: newOrder, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: order.userId,
      total_amount: order.totalAmount,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      shipping_address: shippingAddressJson,
      tracking_id: order.trackingNumber,
      estimated_delivery: order.estimatedDelivery
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw new Error('Failed to create order');
  }

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

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    throw new Error('Failed to create order items');
  }

  return newOrder;
};
