
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { getProductsOnSale, products } from '@/data/products/index';

const DealsPage = () => {
  const [dealsProducts, setDealsProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Get products on sale using the utility function
    const productsOnSale = getProductsOnSale();
    console.log("Sale products loaded:", productsOnSale.length);
    
    // Ensure we get some products even if there are no products on sale
    if (productsOnSale.length === 0) {
      // If no sale products, show some regular products as fallback
      setDealsProducts(products.slice(0, 8));
    } else {
      setDealsProducts(productsOnSale);
    }
  }, []);
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Deals</h1>
      
      {dealsProducts && dealsProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dealsProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No deals available at the moment.</p>
          <p className="text-sm text-gray-400">Check back later for exciting offers!</p>
        </div>
      )}
    </div>
  );
};

export default DealsPage;
