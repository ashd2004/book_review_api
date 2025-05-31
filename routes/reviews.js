const express = require('express');
const router = express.Router();

const {
  getAllReviews,
  getReviewById,
  getReviewsByBook,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllReviews);                // Get all reviews
router.get('/:id', getReviewById);             // Get review by ID

// Get all reviews for a specific book
router.get('/book/:bookId', getReviewsByBook);

// Protected routes (require authentication)
router.post('/book/:bookId', authMiddleware, createReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
