
import React from 'react';
import { CartItem } from '@/types/product';
import { IndianRupee, Lock } from 'lucide-react';
import { formatPriceINR } from '@/data/products';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

interface OrderSummaryProps {
  cartItems: CartItem[];
  cartTotal: number;
  shipping: number;
  tax: number;
  orderTotal: number;
}

const OrderSummary = ({ cartItems, cartTotal, shipping, tax, orderTotal }: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="max-h-60 overflow-y-auto mb-4">
        {cartItems.map(item => (
          <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex py-2 border-b last:border-b-0">
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
              <img 
                src={item.product.images[0]} 
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-3 flex-grow">
              <div className="text-sm font-medium">{item.product.name}</div>
              <div className="text-xs text-gray-500">
                {item.size && `Size: ${item.size}`}
                {item.size && item.color && ' / '}
                {item.color && `Color: ${item.color}`}
              </div>
              <div className="text-xs">
                {formatPriceINR(item.product.salePrice || item.product.price)} × {item.quantity}
              </div>
            </div>
            <div className="ml-2 font-medium text-sm">
              {formatPriceINR((item.product.salePrice || item.product.price) * item.quantity)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mb-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="coupon">
            <AccordionTrigger className="text-sm py-2">Apply Coupon Code</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-grow rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <Button variant="outline" size="sm">Apply</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="space-y-3 text-sm border-t pt-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="flex items-center">
            <IndianRupee size={14} className="mr-1" /> {cartTotal.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="flex items-center">
            {shipping === 0 ? 'Free' : (
              <><IndianRupee size={14} className="mr-1" /> {shipping.toLocaleString('en-IN')}</>
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">GST (18%)</span>
          <span className="flex items-center">
            <IndianRupee size={14} className="mr-1" /> {tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span className="flex items-center">
              <IndianRupee size={14} className="mr-1" /> {orderTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
        <Lock size={12} className="mr-1" />
        All transactions are secure and encrypted
      </div>
      
      <div className="mt-4">
        <p className="text-xs text-gray-500 text-center mb-2">We Accept</p>
        <div className="flex justify-center space-x-2">
          <div className="bg-gray-100 p-1 rounded">
            <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6 w-6 object-contain" />
          </div>
          <div className="bg-gray-100 p-1 rounded">
            <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" className="h-6 w-6 object-contain" />
          </div>
          <div className="bg-gray-100 p-1 rounded">
            <img src="https://cdn-icons-png.flaticon.com/512/825/825454.png" alt="UPI" className="h-6 w-6 object-contain" />
          </div>
          <div className="bg-gray-100 p-1 rounded">
            <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-6 w-6 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
