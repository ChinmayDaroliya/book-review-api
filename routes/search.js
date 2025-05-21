const express = require('express');
const { searchBooks } = require('../controllers/search');

const router = express.Router();

router.get('/', searchBooks);

module.exports = router;