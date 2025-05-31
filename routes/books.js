const express = require('express');
const router = express.Router();

const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

const authMiddleware = require('../middleware/authMiddleware');  // your auth middleware

router.get('/', getAllBooks);             // public route
router.get('/:id', getBookById);          // public route

// protect these routes - require user to be logged in
router.post('/', authMiddleware, createBook);
router.put('/:id', authMiddleware, updateBook);
router.delete('/:id', authMiddleware, deleteBook);

module.exports = router;
