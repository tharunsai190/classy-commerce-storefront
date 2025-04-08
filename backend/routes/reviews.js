
const express = require('express');
const { getDb } = require('../config/database');
const { auth } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const db = getDb();
    
    const [reviews] = await db.query(
      'SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC',
      [req.params.productId]
    );
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Get reviews by user
router.get('/user', auth, async (req, res) => {
  try {
    const db = getDb();
    
    const [reviews] = await db.query(
      `SELECT r.*, p.name as productName, p.images
       FROM reviews r
       JOIN products p ON r.productId = p.id
       WHERE r.userId = ?
       ORDER BY r.createdAt DESC`,
      [req.user.id]
    );
    
    // Format reviews
    const formattedReviews = reviews.map(review => ({
      ...review,
      productImage: JSON.parse(review.images)[0] || ''
    }));
    
    res.json(formattedReviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Error fetching user reviews' });
  }
});

// Create a review
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    
    // Validation
    if (!productId || !rating) {
      return res.status(400).json({ message: 'Product ID and rating are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const db = getDb();
    
    // Check if product exists
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user already reviewed this product
    const [existingReviews] = await db.query(
      'SELECT * FROM reviews WHERE productId = ? AND userId = ?',
      [productId, req.user.id]
    );
    
    if (existingReviews.length > 0) {
      // Update existing review instead of creating a new one
      await db.query(
        'UPDATE reviews SET rating = ?, comment = ?, createdAt = NOW() WHERE id = ?',
        [rating, comment || '', existingReviews[0].id]
      );
      
      const [updatedReview] = await db.query('SELECT * FROM reviews WHERE id = ?', [existingReviews[0].id]);
      
      // Update product average rating
      await updateProductRating(db, productId);
      
      return res.json({
        ...updatedReview[0],
        message: 'Review updated successfully'
      });
    }
    
    // Create new review
    const reviewId = uuidv4();
    await db.query(
      'INSERT INTO reviews (id, productId, userId, userName, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
      [
        reviewId,
        productId,
        req.user.id,
        `${req.user.firstName} ${req.user.lastName}`,
        rating,
        comment || ''
      ]
    );
    
    const [newReview] = await db.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
    
    // Update product average rating
    await updateProductRating(db, productId);
    
    res.status(201).json({
      ...newReview[0],
      message: 'Review submitted successfully'
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
});

// Update product average rating
async function updateProductRating(db, productId) {
  const [result] = await db.query(
    'SELECT AVG(rating) as avgRating FROM reviews WHERE productId = ?',
    [productId]
  );
  
  if (result[0].avgRating) {
    await db.query(
      'UPDATE products SET rating = ? WHERE id = ?',
      [result[0].avgRating, productId]
    );
  }
}

// Delete a review
router.delete('/:id', auth, async (req, res) => {
  try {
    const db = getDb();
    
    // Check if review exists and belongs to user
    const [reviews] = await db.query(
      'SELECT * FROM reviews WHERE id = ? AND userId = ?',
      [req.params.id, req.user.id]
    );
    
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'Review not found or not authorized' });
    }
    
    const productId = reviews[0].productId;
    
    // Delete review
    await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
    
    // Update product average rating
    await updateProductRating(db, productId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

module.exports = router;
