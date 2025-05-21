const express = require('express');
const { addReview, updateReview, deleteReview } = require('../controllers/reviews');
const { protect } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
  .post(protect, addReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;