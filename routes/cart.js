const express = require('express');
const router = express.Router();
const {addToCart} = require('../controllers/cart');
const {showCart} = require('../controllers/cart');
const {deleteProduct} = require('../controllers/cart');
const {updateQuantity} = require('../controllers/cart');
router.post('/addToCart',  addToCart);
router.put('/updateQuantity/:id',  updateQuantity);
router.get("/",showCart);
router.delete("/:id",deleteProduct)
module.exports = router;