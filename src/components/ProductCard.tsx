
import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { formatPriceINR } from '@/data/products/index';
import { toast } from 'sonner';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

// Collection of fallback images by category
const fallbackImages = {
  men: "https://images.unsplash.com/photo-1617137968427-85924c800b22",
  women: "https://images.unsplash.com/photo-1612336307429-8a898d10e223",
  electronics: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
  accessories: "https://images.unsplash.com/photo-1576243345690-4e4b79b63288",
  home_kitchen: "https://images.unsplash.com/photo-1584917865442-de89df41a097",
  default: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
};

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  
  const handleAddToCart = () => {
    addToCart(product, 1);
    
    toast(`${product.name} added to cart`, {
      description: "Item has been added to your cart"
    });
  };

  // Enhanced function to get a valid product image
  const getProductImage = () => {
    if (!imageError && product?.images && product.images.length > 0 && product.images[0]) {
      return product.images[0];
    }
    
    // Use category-specific fallback or default fallback
    const category = product?.category || 'default';
    return fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.default;
  };

  if (!product) {
    return null;
  }

  return (
    <div className="group flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`} className="relative h-60 w-full overflow-hidden">
        <img
          src={getProductImage()}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
        />
        {product.stock < 5 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Low Stock
          </span>
        )}
        {product.salePrice && (
          <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
            Sale
          </span>
        )}
      </Link>
      
      <div className="flex flex-col flex-grow p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-medium line-clamp-2 mb-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-xs text-gray-500 ml-1">
              {product.rating}
            </span>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center space-x-2 mb-3">
            {product.salePrice ? (
              <>
                <span className="font-bold text-primary">
                  {formatPriceINR(product.salePrice)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formatPriceINR(product.price)}
                </span>
              </>
            ) : (
              <span className="font-bold">
                {formatPriceINR(product.price)}
              </span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
