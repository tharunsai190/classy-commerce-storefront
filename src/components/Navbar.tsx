
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold">StyleShop</h1>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-primary transition-colors">
              All Products
            </Link>
            <Link to="/category/men" className="text-gray-700 hover:text-primary transition-colors">
              Men
            </Link>
            <Link to="/category/women" className="text-gray-700 hover:text-primary transition-colors">
              Women
            </Link>
            <Link to="/category/accessories" className="text-gray-700 hover:text-primary transition-colors">
              Accessories
            </Link>
            <Link to="/orders" className="text-gray-700 hover:text-primary transition-colors">
              Orders
            </Link>
          </div>
          
          {/* Search, User, Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-700">
              <Search size={20} />
            </Button>
            <Link to="/account">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <User size={20} />
              </Button>
            </Link>
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <ShoppingCart size={20} />
              </Button>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link to="/orders" className="relative">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Package size={20} />
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-gray-700">
                <ShoppingCart size={20} />
              </Button>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Button variant="ghost" onClick={toggleMenu} className="text-gray-700">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3 animate-fadeIn">
            <Link
              to="/products"
              className="block py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              to="/category/men"
              className="block py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Men
            </Link>
            <Link
              to="/category/women"
              className="block py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Women
            </Link>
            <Link
              to="/category/accessories"
              className="block py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Accessories
            </Link>
            <Link
              to="/orders"
              className="block py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Orders
            </Link>
            <div className="flex space-x-3 pt-2">
              <Link to="/account" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <User size={20} />
                </Button>
              </Link>
              <Link to="/orders" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Package size={20} />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="text-gray-700">
                <Search size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
