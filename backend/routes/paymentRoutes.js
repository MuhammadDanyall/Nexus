const express = require('express');
const router = express.Router();
const { checkout, getTransactionHistory, transfer } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/checkout', checkout);
router.post('/transfer', transfer);
router.get('/history', getTransactionHistory);

module.exports = router;
