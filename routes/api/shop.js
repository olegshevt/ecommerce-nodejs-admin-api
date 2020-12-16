const express = require('express');
const productsController = require('../../controllers/api/shop');
const searchController = require('../../controllers/api/search');
const newsController = require('../../controllers/api/news');
const favouriteController = require('../../controllers/api/favourite');
const cartController = require('../../controllers/api/cart');


const isAuth = require('../../middleware/is-auth');
const permit = require('../../middleware/permit');

const router = express.Router();

//Products
router.post('/products', productsController.getProducts);
router.post('/product/:productId', productsController.getProduct);

//Categories
router.get('/categories', productsController.getCategories);

// isAuth, permit('register')
//Orders
router.post('/make-order', productsController.postOrder);
router.post('/orders', productsController.posGetOrder);

//Search
router.post('/search', searchController.getSearch);

//News
router.get('/news', newsController.getNews);
router.post('/news/:newsId', newsController.getNewsItem);

//Favourite
router.post('/favourite', favouriteController.getFavourite);
router.post('/add-favourite', favouriteController.postFavourite);
router.post('/delete-favourite', favouriteController.postFavouriteDeleteProduct);

//Cart
router.post('/cart', cartController.getCart);
router.post('/add-cart', cartController.postCart);
router.post('/delete-cart', cartController.postCartDeleteProduct);
router.post('/clear-cart', cartController.postClearCart);
router.post('/cart-plus', cartController.postPlusCart);
router.post('/cart-minus', cartController.postMinusCart);

// what should with plus / minus / removeOneItem


module.exports = router;