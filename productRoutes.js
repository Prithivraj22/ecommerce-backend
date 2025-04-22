const express = require('express');
const router = express.Router();

router.post('/product', createProduct);
router.get('/products', getAllProducts);
router.get('/product/:id', getProduct);

module.exports = router;
