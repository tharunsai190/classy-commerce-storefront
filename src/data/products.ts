import { Product } from "@/types/product";

export const USD_TO_INR = 75;

export const products: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    description: "A comfortable and versatile white t-shirt made from 100% organic cotton. Perfect for casual everyday wear.",
    price: 1875,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
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
    name: "Denim Jacket",
    description: "Classic denim jacket with modern styling. Perfect for layering in any season.",
    price: 4999,
    images: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef"],
    category: "men",
    tags: ["jacket", "denim", "casual"],
    rating: 4.7,
    stock: 35,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Black"],
    featured: true,
  },
  {
    id: "3",
    name: "Floral Summer Dress",
    description: "Light and airy floral dress perfect for summer days.",
    price: 3599,
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446"],
    category: "women",
    tags: ["dress", "summer", "floral"],
    rating: 4.6,
    stock: 40,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue", "Pink", "Yellow"],
    newArrival: true,
  },
  {
    id: "4",
    name: "Smart Watch Pro",
    description: "Advanced smartwatch with health monitoring and notifications.",
    price: 15999,
    images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12"],
    category: "electronics",
    tags: ["smartwatch", "technology", "fitness"],
    rating: 4.8,
    stock: 25,
    colors: ["Black", "Silver", "Rose Gold"],
    featured: true,
  },
  {
    id: "5",
    name: "Leather Backpack",
    description: "Stylish and durable leather backpack for everyday use.",
    price: 6999,
    images: ["https://images.unsplash.com/photo-1548546738-8509cb246ed3"],
    category: "accessories",
    tags: ["backpack", "leather", "fashion"],
    rating: 4.5,
    stock: 30,
    colors: ["Brown", "Black", "Tan"],
    bestSeller: true,
  },
  {
    id: "6",
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium wireless headphones with active noise cancellation.",
    price: 24999,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"],
    category: "electronics",
    tags: ["headphones", "wireless", "audio"],
    rating: 4.9,
    stock: 20,
    colors: ["Black", "Silver", "White"],
    featured: true,
  },
  {
    id: "7",
    name: "Running Shoes",
    description: "Lightweight and comfortable running shoes with excellent support.",
    price: 7999,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
    category: "accessories",
    tags: ["shoes", "running", "sports"],
    rating: 4.7,
    stock: 45,
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["Blue/White", "Black/Red", "Gray/Orange"],
    bestSeller: true,
  },
  {
    id: "8",
    name: "Slouchy Knit Sweater",
    description: "Cozy oversized knit sweater perfect for cool weather.",
    price: 4499,
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27"],
    category: "women",
    tags: ["sweater", "winter", "casual"],
    rating: 4.4,
    stock: 35,
    sizes: ["S", "M", "L"],
    colors: ["Cream", "Gray", "Navy"],
    newArrival: true,
  },
  {
    id: "9",
    name: "Slim Fit Chinos",
    description: "Classic slim fit chinos for a smart casual look.",
    price: 3299,
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a"],
    category: "men",
    tags: ["pants", "casual", "formal"],
    rating: 4.5,
    stock: 40,
    sizes: ["30", "32", "34", "36"],
    colors: ["Khaki", "Navy", "Olive"],
    bestSeller: true,
  },
  {
    id: "10",
    name: "Canvas Tote Bag",
    description: "Spacious canvas tote bag for shopping and everyday use.",
    price: 1999,
    images: ["https://images.unsplash.com/photo-1591561954557-26941169b49e"],
    category: "accessories",
    tags: ["bag", "canvas", "eco-friendly"],
    rating: 4.3,
    stock: 50,
    colors: ["Natural", "Black", "Navy"],
    newArrival: true,
  },
  {
    id: "11",
    name: "Wireless Gaming Mouse",
    description: "High-precision wireless gaming mouse with customizable RGB.",
    price: 5999,
    images: ["https://images.unsplash.com/photo-1527814050087-3793815479db"],
    category: "electronics",
    tags: ["gaming", "mouse", "wireless"],
    rating: 4.8,
    stock: 30,
    colors: ["Black", "White"],
    featured: true,
  },
  {
    id: "12",
    name: "Vintage Leather Watch",
    description: "Classic leather strap watch with vintage design.",
    price: 8999,
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314"],
    category: "accessories",
    tags: ["watch", "leather", "vintage"],
    rating: 4.6,
    stock: 25,
    colors: ["Brown", "Black"],
    featured: true,
  },
  {
    id: "13",
    name: "Pleated Midi Skirt",
    description: "Elegant pleated midi skirt for any occasion.",
    price: 3999,
    images: ["https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa"],
    category: "women",
    tags: ["skirt", "elegant", "formal"],
    rating: 4.5,
    stock: 35,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Navy", "Burgundy"],
    newArrival: true,
  },
  {
    id: "14",
    name: "Wireless Earbuds Pro",
    description: "Premium wireless earbuds with noise cancellation.",
    price: 12999,
    images: ["https://images.unsplash.com/photo-1590658006821-04f4017f3c0e"],
    category: "electronics",
    tags: ["earbuds", "wireless", "audio"],
    rating: 4.9,
    stock: 20,
    colors: ["White", "Black"],
    bestSeller: true,
  },
  {
    id: "15",
    name: "Men's Oxford Shirt",
    description: "Classic Oxford button-down shirt for formal occasions.",
    price: 2999,
    images: ["https://images.unsplash.com/photo-1598032895397-b9472444bf93"],
    category: "men",
    tags: ["shirt", "formal", "business"],
    rating: 4.4,
    stock: 45,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Pink"],
    featured: true,
  },
  {
    id: "16",
    name: "Yoga Mat Premium",
    description: "High-quality non-slip yoga mat with carry strap.",
    price: 2499,
    images: ["https://images.unsplash.com/photo-1592432678016-e910b452f9d5"],
    category: "accessories",
    tags: ["yoga", "fitness", "exercise"],
    rating: 4.7,
    stock: 40,
    colors: ["Purple", "Blue", "Green"],
    newArrival: true,
  },
  {
    id: "17",
    name: "Mechanical Gaming Keyboard",
    description: "RGB mechanical gaming keyboard with custom switches.",
    price: 8999,
    images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae"],
    category: "electronics",
    tags: ["gaming", "keyboard", "mechanical"],
    rating: 4.8,
    stock: 25,
    colors: ["Black"],
    featured: true,
  },
  {
    id: "18",
    name: "Summer Maxi Dress",
    description: "Flowing maxi dress perfect for summer events.",
    price: 4599,
    images: ["https://images.unsplash.com/photo-1496747611176-843222e1e57c"],
    category: "women",
    tags: ["dress", "summer", "maxi"],
    rating: 4.6,
    stock: 30,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue", "Red", "Yellow"],
    newArrival: true,
  },
  {
    id: "19",
    name: "Cargo Pants",
    description: "Versatile cargo pants with multiple pockets.",
    price: 3999,
    images: ["https://images.unsplash.com/photo-1517445312882-bc9910d016b3"],
    category: "men",
    tags: ["pants", "casual", "utility"],
    rating: 4.5,
    stock: 35,
    sizes: ["30", "32", "34", "36"],
    colors: ["Khaki", "Olive", "Black"],
    bestSeller: true,
  },
  {
    id: "20",
    name: "Smart LED TV",
    description: "4K Smart LED TV with HDR support.",
    price: 49999,
    images: ["https://images.unsplash.com/photo-1593784991095-a205069470b6"],
    category: "electronics",
    tags: ["tv", "smart", "entertainment"],
    rating: 4.9,
    stock: 15,
    featured: true,
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
