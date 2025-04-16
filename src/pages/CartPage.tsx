import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, IndianRupee } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatPriceINR } from '@/data/products';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const shipping = cartTotal > 500 ? 0 : 70;
  const tax = cartTotal * 0.18;
  const orderTotal = (cartTotal || 0) + (shipping || 0) + (tax || 0);
  
  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };
  
  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast(`${productName} removed from cart`, {
      description: "Item has been removed from your cart"
    });
  };
  
  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true);
    setTimeout(() => {
      setIsApplyingCoupon(false);
      if (couponCode.toUpperCase() === 'DISCOUNT20') {
        toast.success('Coupon applied successfully!');
      } else {
        toast.error('Invalid or expired coupon code');
      }
    }, 1000);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container py-16 text-center">
        <div className="mx-auto max-w-md">
          <ShoppingBag size={64} className="mx-auto mb-6 text-gray-400" />
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link to="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 border-b text-sm font-medium text-gray-500">
              <div className="md:col-span-6">Product</div>
              <div className="md:col-span-2 text-center">Price</div>
              <div className="md:col-span-2 text-center">Quantity</div>
              <div className="md:col-span-2 text-right">Total</div>
            </div>
            
            {cartItems.map(item => (
              <div key={item.product.id} className="border-b last:border-b-0">
                <div className="grid grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-12 md:col-span-6">
                    <div className="flex">
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <Link 
                          to={`/product/${item.product.id}`}
                          className="text-lg font-medium hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        
                        {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                        {item.color && <p className="text-sm text-gray-500">Color: {item.color}</p>}
                        
                        <button
                          onClick={() => handleRemove(item.product.id, item.product.name)}
                          className="text-sm text-red-500 hover:text-red-600 flex items-center mt-2 md:hidden"
                        >
                          <Trash2 size={14} className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 md:col-span-2 text-center">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Price:</div>
                    <div className="flex items-center justify-center">
                      <IndianRupee size={14} className="mr-1" />
                      {((item.product.salePrice || item.product.price) || 0).toLocaleString('en-IN')}
                    </div>
                  </div>
                  
                  <div className="col-span-5 md:col-span-2 text-center">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Quantity:</div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-md border border-gray-300 disabled:opacity-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="mx-2 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 rounded-md border border-gray-300 disabled:opacity-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-4 md:col-span-2 text-right">
                    <div className="md:hidden text-sm text-gray-500 mb-1">Total:</div>
                    <div className="font-medium flex items-center justify-end">
                      <IndianRupee size={14} className="mr-1" />
                      {(((item.product.salePrice || item.product.price) || 0) * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => handleRemove(item.product.id, item.product.name)}
                      className="text-sm text-red-500 hover:text-red-600 hidden md:inline-flex items-center justify-end w-full mt-2"
                    >
                      <Trash2 size={14} className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Link to="/products">
              <Button variant="outline" size="sm">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="mb-6">
              <label className="block text-sm mb-2">Apply Coupon Code</label>
              <div className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-grow rounded-l-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || isApplyingCoupon}
                  className="rounded-l-none bg-primary hover:bg-primary/90 text-sm px-3"
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Try "DISCOUNT20" for 20% off your order
              </p>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="flex items-center">
                  <IndianRupee size={14} className="mr-1" />
                  {(cartTotal || 0).toLocaleString('en-IN')}
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
                  <IndianRupee size={14} className="mr-1" />
                  {(tax || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="flex items-center">
                    <IndianRupee size={14} className="mr-1" />
                    {(orderTotal || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleCheckout}
              className="w-full mt-6 bg-primary hover:bg-primary/90"
              size="lg"
            >
              Proceed to Checkout
            </Button>
            
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

export default CartPage;
