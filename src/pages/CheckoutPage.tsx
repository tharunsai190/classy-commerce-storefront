
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { PaymentMethod, Address } from '@/types/order';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue checkout');
      navigate('/account');
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);
  
  // Form state with user data pre-filled if available
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    address: Address;
    paymentMethod: PaymentMethod;
    saveInfo: boolean;
  }>({
    fullName: user ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: '',
    address: {
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    paymentMethod: 'credit_card',
    saveInfo: false
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name.includes('.')) {
      // Handle nested address object
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData] as object,
          [child]: value
        }
      });
    } else {
      // Handle regular input
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      });
    }
  };

  // Shipping calculation
  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.07;
  const orderTotal = cartTotal + shipping + tax;

  // Submit order handler
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || 
        !formData.address.street || !formData.address.city || 
        !formData.address.state || !formData.address.zipCode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    // Simulate API call to create order
    setTimeout(() => {
      setIsProcessing(false);
      // In a real application, this is where you would send the order to the server
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    }, 1500);
  };

  // If not authenticated or cart is empty, show nothing (will redirect)
  if (!isAuthenticated || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout Form (Left Column) */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmitOrder}>
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address*
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province*
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zip/Postal Code*
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country*
                    </label>
                    <select
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      required
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === 'credit_card'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Credit Card
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    PayPal
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="apple_pay"
                      checked={formData.paymentMethod === 'apple_pay'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Apple Pay
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="google_pay"
                      checked={formData.paymentMethod === 'google_pay'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Google Pay
                  </label>
                </div>
                
                {formData.paymentMethod === 'credit_card' && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                    <p className="text-sm text-gray-500 mb-2">
                      This is a demo application. No actual payment will be processed.
                    </p>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="4111 1111 1111 1111"
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
                            CVC
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
              </div>
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">
                    Save this information for next time
                  </span>
                </label>
              </div>
            </div>
            
            {/* Submit Button (Mobile Only) */}
            <div className="md:hidden">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Place Order • $${orderTotal.toFixed(2)}`}
              </Button>
            </div>
          </form>
        </div>
        
        {/* Order Summary (Right Column) */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {/* Order Items */}
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
                      ${(item.product.salePrice || item.product.price).toFixed(2)} × {item.quantity}
                    </div>
                  </div>
                  <div className="ml-2 font-medium text-sm">
                    ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Details */}
            <div className="space-y-3 text-sm border-t pt-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Submit Button (Desktop Only) */}
            <div className="hidden md:block mt-6">
              <Button
                type="submit"
                onClick={handleSubmitOrder}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
            
            {/* Payment Methods */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 text-center mb-2">We Accept</p>
              <div className="flex justify-center space-x-2">
                <div className="bg-gray-100 p-1 rounded">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196578.png" alt="Visa" className="h-6 w-6 object-contain" />
                </div>
                <div className="bg-gray-100 p-1 rounded">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196561.png" alt="MasterCard" className="h-6 w-6 object-contain" />
                </div>
                <div className="bg-gray-100 p-1 rounded">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196565.png" alt="PayPal" className="h-6 w-6 object-contain" />
                </div>
                <div className="bg-gray-100 p-1 rounded">
                  <img src="https://cdn-icons-png.flaticon.com/512/196/196539.png" alt="Apple Pay" className="h-6 w-6 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
