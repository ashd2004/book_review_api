const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'Missing query param ?q=' });

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
      ],
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
