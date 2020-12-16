const Product = require('../../models/product');

exports.getSearch = (req, res, next) => {
    const title = req.body.title;
    const page = +req.query.page || 1;
    const perPage = 2;
    let totalItems;

    // Product.find({'title' : new RegExp(title, 'i')})
    Product.find({ 'title': new RegExp(title, 'i') }).countDocuments()
        // Product.find({ title: title }).countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            // return Product.find({ title: title })
            return Product.find({ 'title': new RegExp(title, 'i') })
                .skip((page - 1) * perPage).limit(perPage);
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