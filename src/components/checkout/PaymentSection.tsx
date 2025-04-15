
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Phone, Mail } from 'lucide-react';
import { PaymentMethod, Address } from '@/types/order';

const paymentOptions = [
  { id: 'credit_card' as PaymentMethod, name: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi' as PaymentMethod, name: 'UPI Payment (PhonePe, Google Pay, etc.)', icon: '📱' },
  { id: 'net_banking' as PaymentMethod, name: 'Net Banking', icon: '🏦' },
  { id: 'cod' as PaymentMethod, name: 'Cash on Delivery', icon: '💸' }
];

interface PaymentSectionProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    address: Address;
    paymentMethod: PaymentMethod;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  onBack: () => void;
}

const PaymentSection = ({ formData, handleChange, onSubmit, isProcessing, onBack }: PaymentSectionProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Lock size={20} className="mr-2 text-primary" />
          Payment Method
        </h2>
        
        <div className="space-y-4">
          {paymentOptions.map(option => (
            <div key={option.id} className="border border-gray-200 rounded-md p-3 hover:border-primary transition-colors">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.id}
                  checked={formData.paymentMethod === option.id}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="mr-2">{option.icon}</span>
                <span>{option.name}</span>
              </label>
            </div>
          ))}
          
          {formData.paymentMethod === 'credit_card' && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">
                Enter your card details:
              </p>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {formData.paymentMethod === 'upi' && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">
                Enter your UPI ID:
              </p>
              <input
                type="text"
                placeholder="yourname@upi"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          )}
          
          {formData.paymentMethod === 'net_banking' && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">
                Select your bank:
              </p>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="">Select a bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}
          
          {formData.paymentMethod === 'cod' && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-sm text-gray-700">
                Pay with cash on delivery. Please have the exact amount ready for the delivery person.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Shipping Address</h3>
          <Button 
            type="button" 
            variant="link" 
            className="text-primary p-0" 
            onClick={onBack}
          >
            Edit
          </Button>
        </div>
        <div className="text-sm text-gray-700">
          <p className="font-medium">{formData.fullName}</p>
          <p>{formData.address.street}</p>
          <p>{formData.address.city}, {formData.address.state} {formData.address.zipCode}</p>
          <p>{formData.address.country}</p>
          <p className="mt-1 flex items-center">
            <Phone size={14} className="mr-1" /> {formData.phone}
          </p>
          <p className="flex items-center">
            <Mail size={14} className="mr-1" /> {formData.email}
          </p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-1/2"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-1/2 bg-primary hover:bg-primary/90"
          size="lg"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </div>
    </form>
  );
};

export default PaymentSection;
