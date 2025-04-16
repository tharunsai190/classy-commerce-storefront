import { Product } from "@/types/product";

// Currency conversion rate (approx. 1 USD = 75 INR)
export const USD_TO_INR = 75;

export const products: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    description: "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for casual everyday wear.",
    price: 1875,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    ],
    category: "men",
    tags: ["tshirt", "casual", "cotton"],
    rating: 4.5,
    stock: 50,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray"],
    featured: true,
  },
  {
    id: "6",
    name: "High Waist Yoga Leggings",
    description: "Comfortable high waist leggings perfect for yoga or everyday wear. Features four-way stretch fabric and hidden pocket.",
    price: 5499,
    salePrice: 4499,
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2c",
    ],
    category: "women",
    tags: ["leggings", "activewear", "yoga"],
    rating: 4.6,
    stock: 30,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray"],
    featured: true,
  },
  {
    id: "13",
    name: "Professional Makeup Brush Set",
    description: "Complete set of 12 professional makeup brushes with synthetic bristles. Includes storage case and cleaning solution.",
    price: 3999,
    salePrice: 2999,
    images: [
      "https://images.unsplash.com/photo-1599063403647-900a404a19d3",
    ],
    category: "accessories",
    tags: ["makeup", "beauty", "brushes"],
    rating: 4.8,
    stock: 20,
    featured: true,
  },
  {
    id: "16",
    name: "Lightweight Running Shoes",
    price: 9599,
    salePrice: 7999,
    description: "Ultra-lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for comfort and performance.",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
    ],
    category: "accessories",
    tags: ["shoes", "running", "athletic"],
    rating: 4.7,
    stock: 30,
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Black/White", "Blue/Gray", "Red/Black"],
    featured: true,
  },
  {
    id: "4",
    name: "Leather Crossbody Bag",
    description: "Stylish and functional crossbody bag made from genuine leather. Features multiple compartments and adjustable strap.",
    price: 8999,
    images: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c",
    ],
    category: "accessories",
    tags: ["bag", "leather", "accessories"],
    rating: 4.9,
    stock: 15,
    colors: ["Brown", "Black", "Tan"],
    bestSeller: true,
  },
  {
    id: "5",
    name: "Striped Button-Up Shirt",
    description: "Classic striped button-up shirt perfect for casual or semi-formal occasions. Made from breathable cotton blend.",
    price: 4999,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c",
    ],
    category: "men",
    tags: ["shirt", "button-up", "striped"],
    rating: 4.3,
    stock: 40,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue/White", "Black/White"],
    newArrival: true,
  },
  {
    id: "7",
    name: "Minimalist Watch",
    description: "Elegant minimalist watch with genuine leather strap. Features Japanese movement and water resistance up to 30 meters.",
    price: 6999,
    images: [
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0",
    ],
    category: "accessories",
    tags: ["watch", "accessories", "minimalist"],
    rating: 4.4,
    stock: 25,
    colors: ["Black/Brown", "Silver/Black"],
    newArrival: true,
  },
  {
    id: "9",
    name: "Wireless Bluetooth Earbuds",
    description: "High-quality wireless earbuds with noise cancellation and long battery life. Includes charging case and multiple ear tip sizes.",
    price: 12999,
    salePrice: 9999,
    images: [
      "https://images.unsplash.com/photo-1606741965429-02e23a7352b5",
    ],
    category: "electronics",
    tags: ["earbuds", "wireless", "electronics", "audio"],
    rating: 4.6,
    stock: 45,
    colors: ["Black", "White", "Blue"],
    bestSeller: true,
  },
  {
    id: "10",
    name: "Premium Leather Wallet",
    description: "Handcrafted genuine leather wallet with multiple card slots, bill compartments and RFID blocking technology.",
    price: 4999,
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93",
    ],
    category: "accessories",
    tags: ["wallet", "leather", "accessories"],
    rating: 4.7,
    stock: 30,
    colors: ["Brown", "Black", "Tan"],
  }
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
