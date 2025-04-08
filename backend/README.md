
# StyleShop Backend API

This is the backend API for the StyleShop e-commerce application.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create a .env file based on .env.example:
```bash
cp .env.example .env
```

3. Update the .env file with your MySQL database credentials and JWT secret.

4. Initialize the database:
```bash
npm run init-db
```

5. Start the development server:
```bash
npm run dev
```

## API Routes

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create a new order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `GET /api/reviews/user` - Get user's reviews
- `POST /api/reviews` - Create a product review
- `DELETE /api/reviews/:id` - Delete a review
