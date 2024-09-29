const express = require('express');

const { addProduct } = require('../controllers/product');
const { search } = require('../controllers/product');
const router = express.Router();

router.post('/addProduct', addProduct);
router.get('/search', search);

module.exports = router;
