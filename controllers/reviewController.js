const Review = require('../models/Review');

// Get all reviews for a book
exports.getReviewsByBook = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create review (one per user per book)
exports.createReview = async (req, res) => {
  try {
    const existing = await Review.findOne({ book: req.params.bookId, user: req.user });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const { rating, comment } = req.body;
    const newReview = new Review({ book: req.params.bookId, rating, comment, user: req.user });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    Object.assign(review, req.body);
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// For completeness
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
