const Book = require('../models/Book');
const Review = require('../models/Review');

// @desc    Create new book
// @route   POST /api/v1/books
// @access  Private
exports.createBook = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;
    
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete book
// @route   DELETE /api/v1/books/:id
// @access  Private
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Make sure user owns the book
    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this book'
      });
    }
    
    // First delete all reviews associated with this book
    await Review.deleteMany({ book: req.params.id });
    
    // Now delete the book
    await book.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books
// @route   GET /api/v1/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `${match}`);
    
    // Finding resource
    query = Book.find(JSON.parse(queryStr));
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Book.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const books = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: books.length,
      pagination,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/v1/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Get reviews for book with pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const reviews = await Review.find({ book: req.params.id })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: 'user',
        select: 'name'
      });
    
    // Calculate average rating
    const allReviews = await Review.find({ book: req.params.id });
    let avgRating = 0;
    
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((acc, review) => acc + review.rating, 0);
      avgRating = (totalRating / allReviews.length).toFixed(1);
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...book._doc,
        averageRating: avgRating,
        reviewCount: allReviews.length,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all books
// @route   GET /api/v1/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Book.find(JSON.parse(queryStr));
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Book.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Execute query
    const books = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: books.length,
      pagination,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single book
// @route   GET /api/v1/books/:id
// @access  Public
exports.getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Get reviews for book with pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const reviews = await Review.find({ book: req.params.id })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: 'user',
        select: 'name'
      });
    
    // Calculate average rating
    const allReviews = await Review.find({ book: req.params.id });
    let avgRating = 0;
    
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((acc, review) => acc + review.rating, 0);
      avgRating = (totalRating / allReviews.length).toFixed(1);
    }
    
    res.status(200).json({
      success: true,
      data: {
        ...book._doc,
        averageRating: avgRating,
        reviewCount: allReviews.length,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};