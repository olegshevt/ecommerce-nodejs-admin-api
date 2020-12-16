const express = require('express');
const session = require('express-session');
const { check, body } = require('express-validator');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const permit = require('../middleware/permit');


// /admin/add-product => GET
router.get('/add-product', isAuth, permit('admin'), adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);


// /admin/add-product => POST
router.post('/add-product', isAuth, permit('admin'),
    [body('title', 'Please enter a correct title.')
        .isLength({ min: 5 }).trim()
        .isAlphanumeric(), body('price', 'Please enter a correct price.')
            .trim()
            .isNumeric(), body('description', 'Please enter a correct description.')
                .isLength({ min: 5 }).trim()
    ],
    adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, permit('admin'), adminController.getEditProduct);

router.post('/edit-product', isAuth, permit('admin'), adminController.postEditProduct);

router.delete('/product/:productId', isAuth, permit('admin'), adminController.deleteProduct);

router.get('/categories', adminController.getCategories);

router.get('/add-category', isAuth, permit('admin'), adminController.getAddCategory);

router.post('/add-category', isAuth, permit('admin'), [body('title', 'Please enter a correct title.')
    .isLength({ min: 5 }).trim()], adminController.postAddCategory);

router.get('/edit-category/:categoryId', isAuth, permit('admin'), adminController.getEditCategory);

router.post('/edit-category', isAuth, permit('admin'), adminController.postEditCategory);

router.delete('/category/:categoryId', isAuth, permit('admin'), adminController.deleteCategory);

//News

router.get('/news/news', adminController.getNews);

router.get('/news/add-news', isAuth, permit('admin'), adminController.getAddNews);

router.post('/news/add-news', isAuth, permit('admin'), adminController.postAddNews);

router.get('/news/edit-news/:newsId', isAuth, permit('admin'), adminController.getEditNews);

router.post('/news/edit-news', isAuth, permit('admin'), adminController.postEditNews);

router.delete('/news/news/:newsId', isAuth, permit('admin'), adminController.deleteNews);


module.exports = router;
