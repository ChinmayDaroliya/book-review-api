const Book = require('../models/Book');

// @desc    Search books by title or author
// @route   GET /api/v1/search
// @access  Public 
exports.searchBooks = async (req, res, next) => {
  try {
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a search query'
      });
    }
    
    // Search for books with title or author matching the query (case-insensitive)
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};