const express = require('express');
const { check, body } = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();
const isAuth = require('../middleware/is-auth');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    [body('title', 'Please enter a correct title.')
        .isLength({ min: 5 }).trim()
        .isAlphanumeric(), body('price', 'Please enter a correct price.')
            .trim()
            .isNumeric(), body('description', 'Please enter a correct description.')
                .isLength({ min: 5 }).trim()
                .isAlphanumeric(),],
    adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
