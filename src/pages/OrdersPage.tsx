
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronRight, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getUserOrders } from '@/data/orders';
import { Order, OrderStatus } from '@/types/order';
import { format } from 'date-fns';

const OrdersPage = () => {
  // In a real app, you would get the user ID from authentication
  const userId = "user-123";
  const orders = getUserOrders(userId);
  
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrders.includes(orderId)) {
      setExpandedOrders(expandedOrders.filter(id => id !== orderId));
    } else {
      setExpandedOrders([...expandedOrders, orderId]);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  };
  
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} className="text-yellow-500" />;
      case 'processing':
        return <Clock size={18} className="text-blue-500" />;
      case 'shipped':
        return <Truck size={18} className="text-blue-600" />;
      case 'delivered':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'cancelled':
        return <AlertCircle size={18} className="text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Package size={24} className="mr-2 text-primary" />
        <h1 className="text-3xl font-bold">My Orders</h1>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium mb-2">You haven't placed any orders yet</h3>
          <p className="text-gray-500 mb-4">Once you place an order, it will appear here.</p>
          <Button asChild>
            <Link to="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <>
                  <TableRow 
                    key={order.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      {expandedOrders.includes(order.id) ? 
                        <ChevronDown size={18} /> : 
                        <ChevronRight size={18} />
                      }
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded order details */}
                  {expandedOrders.includes(order.id) && (
                    <TableRow>
                      <TableCell colSpan={5} className="bg-gray-50 p-0">
                        <div className="p-4">
                          <h4 className="font-medium mb-3">Order Details</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h5>
                              <p className="text-sm">
                                {order.shippingAddress.fullName}<br />
                                {order.shippingAddress.street}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                {order.shippingAddress.country}
                              </p>
                            </div>
                            
                            <div>
                              <h5 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h5>
                              <p className="text-sm capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                            </div>
                            
                            <div>
                              {order.trackingNumber && (
                                <>
                                  <h5 className="text-sm font-medium text-gray-500 mb-1">Tracking Number</h5>
                                  <p className="text-sm">{order.trackingNumber}</p>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <h5 className="font-medium mb-2">Items</h5>
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center border-b border-gray-100 pb-2">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>
                                <div className="ml-4 flex-1">
                                  <Link 
                                    to={`/product/${item.product.id}`}
                                    className="font-medium text-sm hover:text-primary"
                                  >
                                    {item.product.name}
                                  </Link>
                                  <div className="flex justify-between mt-1">
                                    <div className="text-sm text-gray-500">
                                      {item.size && <span className="mr-2">Size: {item.size}</span>}
                                      {item.color && <span>Color: {item.color}</span>}
                                      <span className="mx-2">Qty: {item.quantity}</span>
                                    </div>
                                    <p className="text-sm font-medium">
                                      ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 flex justify-between">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs"
                            >
                              Need Help?
                            </Button>
                            
                            {(order.status === 'delivered') && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs"
                              >
                                Write a Review
                              </Button>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Connect to SQL Database</h2>
        <div className="bg-white p-5 rounded-lg border">
          <p className="mb-4">In a production application, you would connect to your SQL database to fetch real order data. Here's how you would implement it:</p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <pre className="text-sm overflow-x-auto">
              {`// Using a database connection library like mysql or pg
import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Function to fetch user orders
export async function fetchUserOrders(userId: string) {
  try {
    const connection = await pool.getConnection();
    
    // Query to get orders with their items
    const [orders] = await connection.query(
      \`SELECT o.id, o.created_at, o.status, o.total_amount, 
        o.payment_method, o.tracking_number,
        a.full_name, a.street, a.city, a.state, a.zip_code, a.country
      FROM orders o
      JOIN addresses a ON o.shipping_address_id = a.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC\`,
      [userId]
    );
    
    // For each order, get its items
    for (const order of orders) {
      const [items] = await connection.query(
        \`SELECT oi.quantity, oi.size, oi.color,
          p.id, p.name, p.price, p.sale_price, p.images
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?\`,
        [order.id]
      );
      
      order.items = items;
    }
    
    connection.release();
    return orders;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}`}
            </pre>
          </div>
          
          <p className="text-sm text-gray-500">
            Note: To implement this in your application, you would need to set up a backend server 
            with appropriate database connection credentials and environment variables.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
