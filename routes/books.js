const express = require('express');
const { createBook, getBooks, getBook, deleteBook } = require('../controllers/books');
const { protect } = require('../middlewares/auth');
const reviewRouter = require('./reviews');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bookId/reviews', reviewRouter);

router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.route('/:id')
  .get(getBook)
  .delete(protect, deleteBook);

module.exports = router;