const Product = require('../../models/product');
const User = require('../../models/user');

// user.populate('cart.items.productId').execPopulate()
exports.getCart = (req, res, next) => {
    const userId = req.body.userId;
    User.findById(userId).then(user => {
        user.populate({
            path: 'cart.items.productId',
            populate: { path: 'categoryId' }
        }).execPopulate().then(user => {
            const products = user.cart.items;
            res.status(200).json({
                message: 'Fetched product successfully',
                products: products,
            })
        })
    })
        .catch(err => console.log(err));
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    const userId = req.body.userId;
    Product.findById(productId)
        .then(product => {
            User.findById(userId).then(user => {
                return user.addToCart(product);
            }).then(result => {
                res.status(200).json({
                    message: 'Fetched product successfully',
                    product: product
                })
            });
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    const userId = req.body.userId;
    User.findById(userId).then(user => {
        user.removeFromCart(productId)
            .then(result => {
                console.log(result, 'BBBBEEE')
                res.status(200).json({
                    message: 'Fetched product successfully',
                    result: result.cart.items,
                })
            })
            .catch(err => console.log(err));
    });
}

exports.postPlusCart = (req, res, next) => {
    const productId = req.body.productId;
    const userId = req.body.userId;
    Product.findById(productId)
        .then(product => {
            User.findById(userId).then(user => {
                return user.plusItemToCart(product);
            }).then(result => {
                res.status(200).json({
                    message: 'Fetched product successfully',
                    product: product,
                })
            });
        })
}

exports.postMinusCart = (req, res, next) => {
    const productId = req.body.productId;
    const userId = req.body.userId;
    Product.findById(productId)
        .then(product => {
            User.findById(userId).then(user => {
                return user.minusItemToCart(product);
            }).then(result => {
                res.status(200).json({
                    message: 'Fetched product successfully',
                    product: product,
                })
            });
        })
}


exports.postClearCart = (req, res, next) => {
    const userId = req.body.userId;
    User.findById(userId).then(user => {
        user.clearCart()
            .then(result => {
                res.status(200).json({
                    message: 'Fetched product successfully',
                    result: result,
                })
            })
            .catch(err => console.log(err));
    });
}

