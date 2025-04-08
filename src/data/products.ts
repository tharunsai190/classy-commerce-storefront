
import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    description: "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for casual everyday wear.",
    price: 24.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
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
    id: "2",
    name: "Slim Fit Denim Jeans",
    description: "Modern slim fit jeans with a comfortable stretch. Made with premium denim for durability and style.",
    price: 59.99,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    ],
    category: "men",
    tags: ["jeans", "denim", "slim fit"],
    rating: 4.8,
    stock: 35,
    sizes: ["30", "32", "34", "36"],
    colors: ["Blue", "Black", "Gray"],
    bestSeller: true,
  },
  {
    id: "3",
    name: "Summer Floral Dress",
    description: "Lightweight floral dress perfect for summer. Features a flattering A-line silhouette and adjustable straps.",
    price: 79.99,
    salePrice: 59.99,
    images: [
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    ],
    category: "women",
    tags: ["dress", "summer", "floral"],
    rating: 4.7,
    stock: 20,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue", "Pink"],
    featured: true,
  },
  {
    id: "4",
    name: "Leather Crossbody Bag",
    description: "Stylish and functional crossbody bag made from genuine leather. Features multiple compartments and adjustable strap.",
    price: 89.99,
    images: [
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df41a097?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
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
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1589310243389-96a5483213a8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
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
    id: "6",
    name: "High Waist Yoga Leggings",
    description: "Comfortable high waist leggings perfect for yoga or everyday wear. Features four-way stretch fabric and hidden pocket.",
    price: 54.99,
    salePrice: 44.99,
    images: [
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
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
    id: "7",
    name: "Minimalist Watch",
    description: "Elegant minimalist watch with genuine leather strap. Features Japanese movement and water resistance up to 30 meters.",
    price: 69.99,
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    ],
    category: "accessories",
    tags: ["watch", "accessories", "minimalist"],
    rating: 4.4,
    stock: 25,
    colors: ["Black/Brown", "Silver/Black"],
    newArrival: true,
  },
  {
    id: "8",
    name: "Oversized Knit Sweater",
    description: "Cozy oversized knit sweater for cooler weather. Made from soft cotton-wool blend for comfort and warmth.",
    price: 64.99,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    ],
    category: "women",
    tags: ["sweater", "knit", "winter"],
    rating: 4.7,
    stock: 18,
    sizes: ["S", "M", "L"],
    colors: ["Beige", "Gray", "Burgundy"],
    bestSeller: true,
  },
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
