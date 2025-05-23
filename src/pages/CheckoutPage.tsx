
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { PaymentMethod, Address, Order, OrderStatus } from '@/types/order';
import { v4 as uuidv4 } from 'uuid';
import AddressForm from '@/components/checkout/AddressForm';
import PaymentSection from '@/components/checkout/PaymentSection';
import OrderSummary from '@/components/checkout/OrderSummary';
import { createOrder } from '@/services/orderService';

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

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue checkout');
      navigate('/account');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name.includes('.')) {
      setFormData({
        ...formData,
        [name.split('.')[0]]: {
          ...formData[name.split('.')[0]] as object,
          [name.split('.')[1]]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      });
    }
  };

  const shipping = cartTotal > 500 ? 0 : 70;
  const tax = cartTotal * 0.18;
  const orderTotal = cartTotal + shipping + tax;

  const goToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.address.street || !formData.address.city || 
        !formData.address.state || !formData.address.zipCode) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        mobileNumber: prev.phone
      }
    }));
    
    setActiveStep('payment');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to place an order');
      navigate('/account');
      return;
    }
    
    setIsProcessing(true);

    try {
      const newOrder: Order = {
        id: '', // Will be generated in orderService
        userId: user.id,
        items: cartItems.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.salePrice || item.product.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.product.images && item.product.images.length > 0 
            ? item.product.images[0] 
            : "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
        })),
        totalAmount: orderTotal,
        status: 'pending' as OrderStatus,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        shippingAddress: formData.address,
        address: formData.address,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: estimatedDelivery
      };

      await createOrder(newOrder);
      
      toast.success('Order placed successfully!');
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {activeStep === 'address' ? (
            <AddressForm
              formData={formData}
              handleChange={handleChange}
              onSubmit={goToPayment}
              estimatedDelivery={estimatedDelivery}
            />
          ) : (
            <PaymentSection
              formData={formData}
              handleChange={handleChange}
              onSubmit={handleSubmitOrder}
              isProcessing={isProcessing}
              onBack={() => setActiveStep('address')}
            />
          )}
        </div>
        
        <div className="md:col-span-1">
          <OrderSummary
            cartItems={cartItems}
            cartTotal={cartTotal}
            shipping={shipping}
            tax={tax}
            orderTotal={orderTotal}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
