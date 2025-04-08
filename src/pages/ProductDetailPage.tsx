import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types/product';
import { getProductById, getRelatedProducts, formatPriceINR } from '@/data/products';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import ReviewDisplay from '@/components/ReviewDisplay';
import ReviewForm from '@/components/ReviewForm';
import { Review } from '@/types/review';
import { useAuth } from '@/context/AuthContext';
import { getProductReviews, submitProductReview } from '@/utils/dbUtils';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');
  const [reviewKey, setReviewKey] = useState(0);

  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  useEffect(() => {
    if (id) {
      const fetchedProduct = getProductById(id);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images[0]);
        setSelectedSize(fetchedProduct.sizes ? fetchedProduct.sizes[0] : undefined);
        setSelectedColor(fetchedProduct.colors ? fetchedProduct.colors[0] : undefined);
        
        const related = getRelatedProducts(id);
        setRelatedProducts(related);
        
        const fetchReviews = async () => {
          try {
            const productReviews = await getProductReviews(id);
            setReviews(productReviews);
          } catch (error) {
            console.error("Error fetching reviews:", error);
          }
        };
        fetchReviews();
      }
    }
  }, [id]);
  
  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (product && value > product.stock) {
      toast.error(`Sorry, only ${product.stock} items available.`);
      return;
    }
    setQuantity(value);
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      product,
      quantity,
      size: selectedSize,
      color: selectedColor
    });
    
    toast(`${product.name} added to cart`, {
      description: `Size: ${selectedSize || 'N/A'}, Quantity: ${quantity}`
    });
  };
  
  const handleAddReview = async (data: { rating: number; comment: string }) => {
    if (!user) {
      toast("Please sign in to leave a review", {
        description: "You need to be logged in to write a review"
      });
      return;
    }

    try {
      await submitProductReview(
        user.id,
        `${user.firstName} ${user.lastName}`, 
        product.id,
        data.rating,
        data.comment
      );
      toast("Review submitted", {
        description: "Thank you for your feedback!"
      });
      
      setReviewKey(prev => prev + 1);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast("Failed to submit review", {
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  if (!product) {
    return (
      <div className="container py-16 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/products" className="text-primary hover:underline mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link 
          to="/products" 
          className="text-sm text-gray-600 hover:text-primary flex items-center"
        >
          <ChevronLeft size={16} />
          <span>Back to Products</span>
        </Link>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <div 
                key={index}
                className={`aspect-square cursor-pointer rounded-md overflow-hidden border-2 ${
                  selectedImage === image ? 'border-primary' : 'border-transparent'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-600">{product.rating} ({reviews.length} reviews)</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              {product.salePrice ? (
                <>
                  <span className="text-2xl font-bold text-primary">
                    {formatPriceINR(product.salePrice)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {formatPriceINR(product.price)}
                  </span>
                  <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-medium rounded">
                    {Math.round((product.price - product.salePrice) / product.price * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold">
                  {formatPriceINR(product.price)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </p>
          </div>
          
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      selectedSize === size
                        ? 'bg-primary text-white border-primary'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map(color => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-full border-2 ${
                      selectedColor === color
                        ? 'ring-2 ring-primary ring-offset-2'
                        : ''
                    }`}
                    style={{ 
                      backgroundColor: color.toLowerCase(), 
                      borderColor: 
                        color.toLowerCase() === 'white' 
                          ? '#e5e7eb' 
                          : color.toLowerCase() 
                    }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  ></button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                className="border border-gray-300 rounded-l-md px-3 py-1 hover:bg-gray-100"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="w-16 border-t border-b border-gray-300 py-1 px-2 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                className="border border-gray-300 rounded-r-md px-3 py-1 hover:bg-gray-100"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary hover:bg-primary/90"
              size="lg"
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
            <Button 
              onClick={() => {
                handleAddToCart();
                setTimeout(() => {
                  window.location.href = '/cart';
                }, 500);
              }}
              className="flex-1"
              variant="outline"
              size="lg"
              disabled={product.stock === 0}
            >
              Buy Now
            </Button>
          </div>
          
          <div className="border-b border-gray-200 mb-4">
            <div className="flex">
              <button
                className={`py-2 px-4 border-b-2 ${
                  activeTab === 'description'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`py-2 px-4 border-b-2 ${
                  activeTab === 'reviews'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviews.length})
              </button>
            </div>
          </div>
          
          {activeTab === 'description' && (
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Product Details:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.tags.map(tag => (
                    <li key={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              {isAuthenticated ? (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Write a Review</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      {[...Array(5)].map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => {
                            const ratingForm = document.getElementById('review-form') as HTMLFormElement;
                            const ratingInput = ratingForm?.querySelector('[name="rating"]') as HTMLInputElement;
                            if (ratingInput) ratingInput.value = String(i + 1);
                          }}
                        >
                          <svg
                            className="w-5 h-5 text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows={3}
                      placeholder="Write your review here..."
                      id="review-comment"
                    ></textarea>
                    <Button 
                      onClick={() => {
                        const comment = (document.getElementById('review-comment') as HTMLTextAreaElement).value;
                        const rating = parseInt((document.querySelector('[name="rating"]') as HTMLInputElement)?.value || "5");
                        handleAddReview({ rating, comment });
                        (document.getElementById('review-comment') as HTMLTextAreaElement).value = '';
                      }}
                      className="self-end"
                    >
                      Submit Review
                    </Button>
                    <form id="review-form" className="hidden">
                      <input type="hidden" name="rating" value="5" />
                    </form>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <p className="text-gray-600 text-sm">
                    Please{' '}
                    <Link to="/account" className="text-primary hover:underline">
                      sign in
                    </Link>{' '}
                    to leave a review.
                  </p>
                </div>
              )}
              
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map(review => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{review.userName}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center my-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600 mt-1">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
