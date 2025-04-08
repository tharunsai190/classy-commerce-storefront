
const express = require('express');
const { getDb } = require('../config/database');
const { auth, adminOnly } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get all products with optional filtering
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    
    let query = 'SELECT * FROM products';
    const queryParams = [];
    
    // Build query with filters
    const { category, search, featured, newArrival, bestSeller } = req.query;
    
    const conditions = [];
    
    if (category) {
      conditions.push('category = ?');
      queryParams.push(category);
    }
    
    if (search) {
      conditions.push('(name LIKE ? OR description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    if (featured === 'true') {
      conditions.push('featured = TRUE');
    }
    
    if (newArrival === 'true') {
      conditions.push('newArrival = TRUE');
    }
    
    if (bestSeller === 'true') {
      conditions.push('bestSeller = TRUE');
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Add order and limit
    const { sort, limit } = req.query;
    
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
      const sortDirection = sort.startsWith('-') ? 'DESC' : 'ASC';
      query += ` ORDER BY ${sortField} ${sortDirection}`;
    } else {
      query += ' ORDER BY createdAt DESC';
    }
    
    if (limit) {
      query += ' LIMIT ?';
      queryParams.push(parseInt(limit));
    }
    
    const [products] = await db.query(query, queryParams);
    
    // Parse JSON fields
    const formattedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      tags: JSON.parse(product.tags || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]')
    }));
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Parse JSON fields
    const product = products[0];
    product.images = JSON.parse(product.images || '[]');
    product.tags = JSON.parse(product.tags || '[]');
    product.sizes = JSON.parse(product.sizes || '[]');
    product.colors = JSON.parse(product.colors || '[]');
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const db = getDb();
    
    const [products] = await db.query('SELECT * FROM products WHERE category = ?', [req.params.category]);
    
    // Parse JSON fields
    const formattedProducts = products.map(product => ({
      ...product,
      images: JSON.parse(product.images || '[]'),
      tags: JSON.parse(product.tags || '[]'),
      sizes: JSON.parse(product.sizes || '[]'),
      colors: JSON.parse(product.colors || '[]')
    }));
    
    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Error fetching products by category' });
  }
});

// Create product (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      salePrice,
      category,
      stock,
      images,
      tags,
      sizes,
      colors,
      featured,
      newArrival,
      bestSeller
    } = req.body;
    
    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({ message: 'Name, price and category are required' });
    }
    
    const db = getDb();
    const productId = uuidv4();
    
    await db.query(
      `INSERT INTO products (
        id, name, description, price, salePrice, category, stock, 
        images, tags, sizes, colors, featured, newArrival, bestSeller
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        name,
        description || '',
        price,
        salePrice || null,
        category,
        stock || 0,
        JSON.stringify(images || []),
        JSON.stringify(tags || []),
        JSON.stringify(sizes || []),
        JSON.stringify(colors || []),
        featured || false,
        newArrival || false,
        bestSeller || false
      ]
    );
    
    const [newProduct] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    // Format response
    if (newProduct[0]) {
      newProduct[0].images = JSON.parse(newProduct[0].images || '[]');
      newProduct[0].tags = JSON.parse(newProduct[0].tags || '[]');
      newProduct[0].sizes = JSON.parse(newProduct[0].sizes || '[]');
      newProduct[0].colors = JSON.parse(newProduct[0].colors || '[]');
    }
    
    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update product (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedFields = { ...req.body };
    
    const db = getDb();
    
    // Check if product exists
    const [existingProduct] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Convert arrays to JSON strings
    if (updatedFields.images) updatedFields.images = JSON.stringify(updatedFields.images);
    if (updatedFields.tags) updatedFields.tags = JSON.stringify(updatedFields.tags);
    if (updatedFields.sizes) updatedFields.sizes = JSON.stringify(updatedFields.sizes);
    if (updatedFields.colors) updatedFields.colors = JSON.stringify(updatedFields.colors);
    
    // Build update query
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    
    if (keys.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    const query = `UPDATE products SET ${keys.map(key => `${key} = ?`).join(', ')} WHERE id = ?`;
    await db.query(query, [...values, productId]);
    
    // Get updated product
    const [updatedProduct] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    // Format response
    if (updatedProduct[0]) {
      updatedProduct[0].images = JSON.parse(updatedProduct[0].images || '[]');
      updatedProduct[0].tags = JSON.parse(updatedProduct[0].tags || '[]');
      updatedProduct[0].sizes = JSON.parse(updatedProduct[0].sizes || '[]');
      updatedProduct[0].colors = JSON.parse(updatedProduct[0].colors || '[]');
    }
    
    res.json(updatedProduct[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const productId = req.params.id;
    const db = getDb();
    
    // Check if product exists
    const [existingProduct] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (existingProduct.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete product
    await db.query('DELETE FROM products WHERE id = ?', [productId]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
