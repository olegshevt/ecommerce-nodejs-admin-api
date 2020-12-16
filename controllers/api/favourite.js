const Product = require('../../models/product');
const User = require('../../models/user');

exports.getFavourite = (req, res, next) => {
    const userId = req.body.userId;
    User.findById(userId).then(user => {
        // console.log(user, 'XZXZ 2')
        user.populate({
            path: 'favourite.items.productId',
            populate: { path: 'categoryId' }
        })
            .execPopulate()
            .then(user => {
                const products = user.favourite.items;
                // console.log(products, 'XZXZ 3')
                res.status(200).json({
                    message: 'Fetched product successfully',
                    products: products,
                })
            })
    })
        .catch(err => console.log(err));
}

exports.postFavourite = (req, res, next) => {
    const productId = req.body.productId;
    const userId = req.body.userId;
    Product.findById(productId)
        .then(product => {
            User.findById(userId).then(user => {
                return user.addToFavourite(product);
            }).then(result => {
                res.status(200).json({
                    message: 'Fetched product successfully',
                    product: product
                })
            });
        })
}

exports.postFavouriteDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    const userId = req.body.userId;
    User.findById(userId).then(user => {
        user.removeFromFavourite(productId)
            .then(result => {
                res.status(200).json({
                    message: 'Fetched product successfully',
                    result: result,
                })
            })
            .catch(err => console.log(err));
    });
}


