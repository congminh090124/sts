const express = require('express');

const { addCategory } = require('../controllers/category');

const router = express.Router();

router.post('/addCategory', addCategory);

module.exports = router;
