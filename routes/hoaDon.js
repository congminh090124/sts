const express = require('express');
const {createInvoice } = require('../controllers/hoaDon');
const { showCTHoaDon } = require('../controllers/hoaDon');
const {showInvoice } = require('../controllers/hoaDon');
const router = express.Router();

router.post('/createInvoice', createInvoice);

router.get("/showInvoice/:userId",showInvoice)

router.get("/showCTHoaDon/:invoiceId", showCTHoaDon);

module.exports = router;
