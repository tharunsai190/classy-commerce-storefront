
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Heart, Share2, ArrowLeft, ShoppingCart, Check } from 'lucide-react';
import { getProductById, getRelatedProducts } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = getProductById(id || '');
  const relatedProducts = getRelatedProducts(id || '', 4);
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes?.[0]);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} added to your cart!`);
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    if (!isWishlisted) {
      toast.success(`${product.name} added to your wishlist!`);
    } else {
      toast.success(`${product.name} removed from your wishlist!`);
    }
  };

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <div className="flex items-center mb-8 text-sm">
        <Link to="/" className="text-gray-500 hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="text-gray-500 hover:text-primary">Products</Link>
        <span className="mx-2">/</span>
        <Link to={`/category/${product.category}`} className="text-gray-500 hover:text-primary capitalize">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </div>
      
      <Link to="/products" className="flex items-center text-gray-600 hover:text-primary mb-6">
        <ArrowLeft size={16} className="mr-1" /> Back to products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-square rounded-lg overflow-hidden">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square cursor-pointer rounded-md overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center text-yellow-400 mr-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>
                  {index < Math.floor(product.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-gray-500">
              ({product.rating.toFixed(1)})
            </span>
          </div>
          
          <div className="mb-4">
            {product.salePrice ? (
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-red-500">${product.salePrice.toFixed(2)}</span>
                <span className="text-xl text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <span className="bg-red-100 text-red-700 text-sm font-medium px-2 py-1 rounded">
                  {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Color: <span className="text-gray-600">{selectedColor}</span></h3>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center ${
                      selectedColor === color ? 'border-2 border-primary' : 'border-gray-300'
                    }`}
                    style={{ 
                      backgroundColor: color.toLowerCase(),
                      color: ['White', 'Beige', 'Yellow', 'Tan'].includes(color) ? '#000' : '#fff'
                    }}
                  >
                    {selectedColor === color && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Size: <span className="text-gray-600">{selectedSize}</span></h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center rounded-md ${
                      selectedSize === size
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Stock Status */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Availability:</h3>
            <div className="flex items-center">
              {product.stock > 0 ? (
                <>
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-green-700">
                    In Stock ({product.stock} {product.stock === 1 ? 'item' : 'items'} available)
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-red-700">Out of Stock</span>
                </>
              )}
            </div>
          </div>
          
          {/* Quantity and Add To Cart */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600 hover:text-gray-700 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-gray-600 hover:text-gray-700 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} /> Add to Cart
              </Button>
              
              <Button
                onClick={toggleWishlist}
                variant="outline"
                className="flex items-center justify-center gap-2"
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} /> 
                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
              </Button>
            </div>
          </div>
          
          {/* Additional Product Info */}
          <div className="mt-6 pt-6 border-t">
            <div className="mb-4">
              <span className="font-medium">SKU:</span> {product.id}
            </div>
            <div className="mb-4">
              <span className="font-medium">Category:</span>{' '}
              <Link to={`/category/${product.category}`} className="text-primary hover:underline capitalize">
                {product.category}
              </Link>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="font-medium">Tags:</span>
              {product.tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/products?tag=${tag}`}
                  className="text-primary hover:underline"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            
            <div className="mt-4 flex items-center space-x-4">
              <button
                className="text-gray-500 hover:text-primary flex items-center"
                onClick={() => {
                  navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href
                  })
                  .catch(err => console.log('Error sharing', err));
                }}
              >
                <Share2 size={18} className="mr-1" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
          <div className="product-grid">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
