const Product = require('../../models/product');
const Order = require('../../models/order');
const User = require('../../models/user');
const Category = require('../../models/category');

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    const perPage = 10;
    let totalItems;
    const categoryId = req.body.categoryId;
    const sort = req.body.sortBy;

    const haveCategoryId = categoryId ? { categoryId: categoryId } : null;
    const haveSortBy = sort ? { price: sort } : null;

    Product.find(haveCategoryId).countDocuments()
        .then(numProducts => {
            totalItems = numProducts;

            return Product.find(haveCategoryId).populate('categoryId').sort(
                haveSortBy
            ).skip((page - 1) * perPage).limit(perPage);
        })
        .then(products => {
            res.status(200).json({
                message: 'Fetched products successfully',
                products: products,
                totalItems: totalItems
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId).populate('categoryId')
        .then(product => {
            // console.log(product, 'PRODE')
            res.status(200).json({
                message: 'Fetched product successfully',
                product: product,
            })

        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getCategories = (req, res, next) => {

    Category.find().countDocuments()
        .then(Categories => {
            totalItems = Categories;
            return Category.find();
        })
        .then(categories => {
            res.status(200).json({
                message: 'Fetched categories successfully',
                categories: categories,
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.postOrder = (req, res, next) => {

    const userId = req.body.userId;
    const total = req.body.total;
    const date = new Date();

    // function toJSONLocal(date) {
    //     var local = new Date(date);
    //     local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    //     return local.toJSON().slice(0, 10);
    // }

    const products = req.body.cartItems.map(i => {
        return { product: { ...i } };
    });
    const order = new Order({
        total,
        products,
        userId,
        date
    });
    order.save().then(result => {
        res.status(200).json({
            message: 'Order created!',
            order: result,
        })
    })
}

exports.posGetOrder = (req, res, next) => {
    const userId = req.body.userId;
    // const user = { 'userId': userId };
    // console.log(user, 'MY USER')
    Order.find({ 'userId': userId }).then(orders => {
        // Order.find().where({ 'user': { 'userId': userId } }).then(orders => {
        console.log(orders)
        res.status(200).json({
            message: 'Fetched product successfully',
            orders: orders,
        })
    })
        .catch(err => console.log(err));
}