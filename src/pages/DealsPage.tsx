
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { getProductsOnSale } from '@/data/products/index';

const DealsPage = () => {
  const [dealsProducts, setDealsProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Get products on sale using the utility function
    const productsOnSale = getProductsOnSale();
    setDealsProducts(productsOnSale);
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
        <p className="text-center py-10 text-gray-500">No deals available at the moment.</p>
      )}
    </div>
  );
};

export default DealsPage;
