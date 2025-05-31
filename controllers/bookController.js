const Book = require('../models/Book');
const Review = require('../models/Review');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, description } = req.body;

    const book = new Book({
      title,
      author,
      description,
      createdBy: req.user
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all books (with pagination + filters)
exports.getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const filter = {};
    if (author) filter.author = new RegExp(author, 'i');
    if (genre) filter.genre = new RegExp(genre, 'i'); // assuming future use

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Book.countDocuments(filter);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      books
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get book by ID with average rating and paginated reviews
exports.getBookById = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const reviews = await Review.find({ book: book._id })
      .populate('user', 'username')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalReviews = await Review.countDocuments({ book: book._id });
    const avgRatingAgg = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    const avgRating = avgRatingAgg[0]?.avgRating || 0;

    res.json({
      book,
      averageRating: avgRating.toFixed(1),
      reviews,
      totalReviews,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update book (optional: only creator)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    Object.assign(book, req.body);
    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete book (optional: only creator)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Search books by title or author
exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Search query is required' });

    const regex = new RegExp(q, 'i');
    const books = await Book.find({
      $or: [{ title: regex }, { author: regex }]
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
