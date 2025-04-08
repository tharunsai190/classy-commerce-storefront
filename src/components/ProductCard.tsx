
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  return (
    <div className="product-card group border border-gray-200 rounded-md">
      <div className="relative overflow-hidden">
        {/* Product image with hover effect */}
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>
        
        {/* Discount badge if on sale */}
        {product.salePrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Sale
          </div>
        )}
        
        {/* Quick action buttons */}
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="icon"
            className={`bg-white rounded-full shadow-sm w-7 h-7 p-1 hover:bg-gray-100 ${
              isWishlisted ? 'text-red-500' : 'text-gray-600'
            }`}
            onClick={toggleWishlist}
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </Button>
        </div>
        
        {/* Quick add to cart button (appears on hover) */}
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 py-1.5 px-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <Button 
            onClick={handleAddToCart} 
            className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-1 text-xs py-1"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* Product info */}
      <div className="p-3">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm text-gray-900 mb-1 hover:text-primary transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-between items-center">
          <div>
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">${product.salePrice.toFixed(2)}</span>
                <span className="text-gray-500 text-xs line-through">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="font-semibold text-sm">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {product.rating > 0 && (
              <div className="flex items-center">
                <span className="mr-1">{product.rating}</span>
                <span className="text-yellow-400">★</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
