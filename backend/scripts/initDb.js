
require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Sample data for initial database
const mockUsers = [
  {
    id: uuidv4(),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user'
  },
  {
    id: uuidv4(),
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin'
  }
];

// SQL statements to create database schema
const createSchema = [
  `
  CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    salePrice DECIMAL(10, 2),
    category VARCHAR(100) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    images JSON,
    tags JSON,
    sizes JSON,
    colors JSON,
    featured BOOLEAN DEFAULT FALSE,
    newArrival BOOLEAN DEFAULT FALSE,
    bestSeller BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    userId VARCHAR(36) NOT NULL,
    totalAmount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    paymentMethod VARCHAR(50) NOT NULL,
    paymentStatus ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    shippingAddress JSON NOT NULL,
    trackingNumber VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    orderId VARCHAR(36) NOT NULL,
    productId VARCHAR(36) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL,
    size VARCHAR(10),
    color VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id),
    FOREIGN KEY (productId) REFERENCES products(id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(36) PRIMARY KEY,
    productId VARCHAR(36) NOT NULL,
    userId VARCHAR(36) NOT NULL,
    userName VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (productId) REFERENCES products(id),
    FOREIGN KEY (userId) REFERENCES users(id)
  )
  `
];

// Initialize database
async function initDatabase() {
  console.log('Starting database initialization...');
  
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'styleshop'}`);
    console.log(`Database ${process.env.DB_NAME || 'styleshop'} created or already exists.`);
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'styleshop'}`);
    
    // Create tables
    for (const sql of createSchema) {
      await connection.query(sql);
    }
    console.log('Database tables created successfully!');
    
    // Insert sample users
    for (const user of mockUsers) {
      const [existingUsers] = await connection.query(
        'SELECT * FROM users WHERE email = ?',
        [user.email]
      );
      
      if (existingUsers.length === 0) {
        await connection.query(
          'INSERT INTO users (id, email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?, ?)',
          [user.id, user.email, user.password, user.firstName, user.lastName, user.role]
        );
        console.log(`User ${user.email} created.`);
      } else {
        console.log(`User ${user.email} already exists.`);
      }
    }
    
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run initialization
initDatabase();
