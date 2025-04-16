
import { Order, OrderItem } from '@/types/order';
import { v4 as uuidv4 } from 'uuid';
import { addOrder } from '@/data/orders';

export const createOrder = async (order: Order) => {
  if (!order.userId) {
    throw new Error('User ID is required to create an order');
  }

  try {
    // Generate a unique ID for the order
    const newOrderId = `ORD-${uuidv4().slice(0, 8)}`;
    
    // Create a new order object with the generated ID
    const newOrder = {
      ...order,
      id: newOrderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add the order to our mock database
    const savedOrder = addOrder(newOrder);
    
    return savedOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
};
