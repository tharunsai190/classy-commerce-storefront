
import { Product, Category } from "@/types/product";
import { menProducts } from "./categories/men";
import { womenProducts } from "./categories/women";
import { electronicsProducts } from "./categories/electronics";
import { accessoriesProducts } from "./categories/accessories";
import { homeKitchenProducts } from "./categories/home_kitchen";

export const USD_TO_INR = 75;

// Combine all products from different categories
export const products: Product[] = [
  ...menProducts,
  ...womenProducts,
  ...electronicsProducts,
  ...accessoriesProducts,
  ...homeKitchenProducts
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getBestSellerProducts = (): Product[] => {
  return products.filter(product => product.bestSeller);
};

export const getNewArrivalProducts = (): Product[] => {
  return products.filter(product => product.newArrival);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (productId: string, limit = 4): Product[] => {
  const currentProduct = getProductById(productId);
  if (!currentProduct) return [];
  
  return products
    .filter(product => 
      product.id !== productId && 
      (product.category === currentProduct.category || 
        product.tags.some(tag => currentProduct.tags.includes(tag)))
    )
    .slice(0, limit);
};

export const getProductsOnSale = (): Product[] => {
  return products.filter(product => product.salePrice !== undefined);
};

export const formatPriceINR = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};
