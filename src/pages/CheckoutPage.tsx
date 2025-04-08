
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { PaymentMethod, Address } from '@/types/order';
import { formatPriceINR } from '@/data/products';
import { IndianRupee, Lock, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Payment options for India
const paymentOptions = [
  { id: 'credit_card', name: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi', name: 'UPI Payment (PhonePe, Google Pay, etc.)', icon: '📱' },
  { id: 'net_banking', name: 'Net Banking', icon: '🏦' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💸' }
];

// Calculate random delivery date between 3-7 days from now
const getEstimatedDeliveryDate = () => {
  const today = new Date();
  const deliveryDays = Math.floor(Math.random() * 5) + 3; // 3-7 days
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + deliveryDays);
  return deliveryDate.toLocaleDateString('en-IN', { 
    weekday: 'long',
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState<'address' | 'payment'>('address');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');
  
  useEffect(() => {
    setEstimatedDelivery(getEstimatedDeliveryDate());
  }, []);
  
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
      country: 'India',
      mobileNumber: ''
    },
    paymentMethod: 'cod',
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
  const shipping = cartTotal > 500 ? 0 : 70; // Free shipping over ₹500
  const tax = cartTotal * 0.18; // 18% GST
  const orderTotal = cartTotal + shipping + tax;

  // Step control
  const goToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for address
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.address.street || !formData.address.city || 
        !formData.address.state || !formData.address.zipCode) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate phone number (basic Indian format validation)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    
    // Set mobile number same as phone
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        mobileNumber: prev.phone
      }
    }));
    
    setActiveStep('payment');
  };

  // Submit order handler
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsProcessing(true);

    // Simulate API call to create order and process payment
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
          {activeStep === 'address' ? (
            <form onSubmit={goToPayment}>
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin size={20} className="mr-2 text-primary" />
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        Mobile Number*
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        required
                      />
                    </div>
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
                      Address (House No, Building, Street, Area)*
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
                        State*
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
                        PIN Code*
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
                        <option value="India">India</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock size={20} className="mr-2 text-primary" />
                  Delivery Information
                </h2>
                <div className="p-4 border border-gray-200 rounded-md bg-gray-50 mb-4">
                  <div className="flex items-center mb-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-sm font-medium">Estimated Delivery</p>
                  </div>
                  <p className="text-gray-600">{estimatedDelivery}</p>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                Continue to Payment
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitOrder}>
              {/* Payment Method */}
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
                  
                  {/* Conditional content based on payment method */}
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
              
              {/* Shipping Address Review */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Shipping Address</h3>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-primary p-0" 
                    onClick={() => setActiveStep('address')}
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
                  onClick={() => setActiveStep('address')}
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
          )}
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
                      {formatPriceINR(item.product.salePrice || item.product.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="ml-2 font-medium text-sm">
                    {formatPriceINR((item.product.salePrice || item.product.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Coupon Code */}
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
            
            {/* Order Details */}
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
            
            {/* Payment Secure Message */}
            <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
              <Lock size={12} className="mr-1" />
              All transactions are secure and encrypted
            </div>
            
            {/* Payment Methods */}
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
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
