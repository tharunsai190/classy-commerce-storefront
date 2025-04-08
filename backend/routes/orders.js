
const express = require('express');
const { getDb } = require('../config/database');
const { auth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get all orders for current user
router.get('/', auth, async (req, res) => {
  try {
    const db = getDb();
    
    // Get orders
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC',
      [req.user.id]
    );
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
      // Parse shipping address from JSON
      order.shippingAddress = JSON.parse(order.shippingAddress);
      
      // Get items for this order
      const [items] = await db.query(
        `SELECT oi.*, p.name as productName, p.images 
         FROM order_items oi
         JOIN products p ON oi.productId = p.id
         WHERE oi.orderId = ?`,
        [order.id]
      );
      
      // Format items
      const formattedItems = items.map(item => ({
        ...item,
        image: JSON.parse(item.images)[0] || ''
      }));
      
      return {
        ...order,
        items: formattedItems
      };
    }));
    
    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Get specific order
router.get('/:id', auth, async (req, res) => {
  try {
    const db = getDb();
    
    // Get order
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND userId = ?',
      [req.params.id, req.user.id]
    );
    
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const order = orders[0];
    order.shippingAddress = JSON.parse(order.shippingAddress);
    
    // Get order items
    const [items] = await db.query(
      `SELECT oi.*, p.name as productName, p.images 
       FROM order_items oi
       JOIN products p ON oi.productId = p.id
       WHERE oi.orderId = ?`,
      [order.id]
    );
    
    // Format items
    const formattedItems = items.map(item => ({
      ...item,
      image: JSON.parse(item.images)[0] || ''
    }));
    
    res.json({
      ...order,
      items: formattedItems
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
});

// Create new order
router.post('/', auth, async (req, res) => {
  const db = getDb();
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { items, shippingAddress, paymentMethod } = req.body;
    
    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain items' });
    }
    
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({ message: 'Payment method is required' });
    }
    
    // Calculate total amount and validate products
    let totalAmount = 0;
    
    for (const item of items) {
      // Verify product exists and has enough stock
      const [products] = await connection.query(
        'SELECT id, price, salePrice, stock FROM products WHERE id = ?',
        [item.productId]
      );
      
      if (products.length === 0) {
        await connection.rollback();
        return res.status(400).json({ message: `Product ${item.productId} not found` });
      }
      
      const product = products[0];
      
      if (product.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({ 
          message: `Not enough stock for product ${item.productId}. Available: ${product.stock}` 
        });
      }
      
      // Calculate price (use sale price if available)
      const price = product.salePrice || product.price;
      totalAmount += price * item.quantity;
      
      // Update stock
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }
    
    // Create order
    const orderId = uuidv4();
    await connection.query(
      `INSERT INTO orders (
        id, userId, totalAmount, status, paymentMethod, paymentStatus, shippingAddress
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        req.user.id,
        totalAmount,
        'pending',
        paymentMethod,
        'pending',
        JSON.stringify(shippingAddress)
      ]
    );
    
    // Create order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (
          id, orderId, productId, price, quantity, size, color
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          orderId,
          item.productId,
          item.price,
          item.quantity,
          item.size || null,
          item.color || null
        ]
      );
    }
    
    await connection.commit();
    
    // Get created order
    const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    order[0].shippingAddress = JSON.parse(order[0].shippingAddress);
    
    // Get order items
    const [orderItems] = await db.query(
      `SELECT oi.*, p.name as productName, p.images 
       FROM order_items oi
       JOIN products p ON oi.productId = p.id
       WHERE oi.orderId = ?`,
      [orderId]
    );
    
    // Format items
    const formattedItems = orderItems.map(item => ({
      ...item,
      image: JSON.parse(item.images)[0] || ''
    }));
    
    res.status(201).json({
      ...order[0],
      items: formattedItems
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  } finally {
    connection.release();
  }
});

module.exports = router;
