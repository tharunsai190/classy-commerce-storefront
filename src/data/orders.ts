
import { Order } from "@/types/order";
import { products } from "./products";

// Mock orders data
export const orders: Order[] = [
  {
    id: "ORD-1001",
    userId: "user-123",
    items: [
      {
        product: products[0],
        quantity: 2,
        size: "L"
      },
      {
        product: products[2],
        quantity: 1,
        size: "M"
      }
    ],
    totalAmount: 169.97,
    status: "delivered",
    paymentMethod: "credit_card",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    },
    createdAt: "2023-12-01T10:30:00Z",
    updatedAt: "2023-12-04T15:20:00Z",
    trackingNumber: "TRK-87654321"
  },
  {
    id: "ORD-1002",
    userId: "user-123",
    items: [
      {
        product: products[3],
        quantity: 1
      }
    ],
    totalAmount: 89.99,
    status: "shipped",
    paymentMethod: "paypal",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    },
    createdAt: "2024-01-15T14:20:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
    trackingNumber: "TRK-45678901"
  },
  {
    id: "ORD-1003",
    userId: "user-123",
    items: [
      {
        product: products[4],
        quantity: 1,
        size: "M"
      },
      {
        product: products[6],
        quantity: 1
      },
      {
        product: products[7],
        quantity: 2,
        size: "S",
        color: "Beige"
      }
    ],
    totalAmount: 249.96,
    status: "processing",
    paymentMethod: "credit_card",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    },
    createdAt: "2024-03-25T11:45:00Z",
    updatedAt: "2024-03-25T14:30:00Z"
  },
  {
    id: "ORD-1004",
    userId: "user-123",
    items: [
      {
        product: products[9],
        quantity: 1
      }
    ],
    totalAmount: 49.99,
    status: "pending",
    paymentMethod: "apple_pay",
    shippingAddress: {
      fullName: "John Doe",
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "United States"
    },
    createdAt: "2024-04-06T09:10:00Z",
    updatedAt: "2024-04-06T09:10:00Z"
  }
];

export const getUserOrders = (userId: string): Order[] => {
  return orders.filter(order => order.userId === userId);
};

export const getOrderById = (orderId: string): Order | undefined => {
  return orders.find(order => order.id === orderId);
};
