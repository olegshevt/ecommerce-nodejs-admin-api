const Product = require('../models/product');
const Category = require('../models/category');
const News = require('../models/news');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');
const { DateTime } = require("luxon");


exports.getAddProduct = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  const categoriesItem = Category.find().then(cat => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      categories: cat,
      errorMessage: message,
      oldInputs: { title: '', imageUrl: '', description: '', price: '', categories: '' },
      validationErrors: []
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const categoryId = req.body.categories;

  if (!imageUrl) {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add product',
      editing: false,
      oldInputs: { title: title, imageUrl: imageUrl, description: description, price: price },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const errors = validationResult(req);
  const imagePath = imageUrl.path;
  if (!errors.isEmpty()) {
    Category.find().then(categories => {
      return res.status(422).render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add product',
        categories: categories,
        errorMessage: errors.array()[0].msg,
        editing: false,
        oldInputs: { title: title, imageUrl: imageUrl, description: description, price: price },
        validationErrors: errors.array()
      });
    })
  } else {
    const product = new Product({
      title: title,
      price: price,
      description: description,
      imageUrl: imagePath,
      categoryId: categoryId,
      userId: req.user
    });
    product
      .save()
      .then(result => {
        console.log('Created Product');
        res.redirect('/admin/products');
      })
      .catch(err => {
        console.log(err);
      });
  }
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  // const categories = Category.find().then(cat => {
  //   return cat;
  // });

  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      Category.find().then(categories => {
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
          categories: categories,
          errorMessage: message,
          validationErrors: []
        });
      })
    })
    .catch(err => console.log(err));
};


exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.file;
  const updatedDesc = req.body.description;
  const updatedCat = req.body.category;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (updatedImageUrl) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = updatedImageUrl.path;
      }
      product.category = updatedCat;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    }).then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed!' });
    })
};

//Categories
exports.getAddCategory = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('admin/edit-category', {
    pageTitle: 'Add Category',
    path: '/admin/add-category',
    editing: false,
    errorMessage: message,
    oldInputs: { title: '', imageUrl: '' },
    validationErrors: []
  });
};

exports.postAddCategory = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.file;
  const errors = validationResult(req);

  if (!imageUrl) {
    return res.status(422).render('admin/edit-category', {
      path: '/admin/add-category',
      pageTitle: 'Add category',
      editing: false,
      oldInputs: { title: title, imageUrl: imageUrl },
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }

  const imagePath = imageUrl.path;

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-category', {
      path: '/admin/add-category',
      pageTitle: 'Add category',
      errorMessage: errors.array()[0].msg,
      editing: false,
      oldInputs: { title: title, imageUrl: imageUrl },
      validationErrors: errors.array()
    });
  } else {
    const category = new Category({
      title: title,
      imageUrl: imagePath,
      userId: req.user
    });
    category
      .save()
      .then(result => {
        res.redirect('/admin/categories');
      })
      .catch(err => {
        console.log(err);
      });
  }
};

exports.getCategories = (req, res, next) => {
  Category.find()
    .then(categories => {
      res.render('admin/categories', {
        categories: categories,
        pageTitle: 'Admin Categories',
        path: '/admin/categories'
      });
    })
    .catch(err => console.log(err));
};

exports.deleteCategory = (req, res, next) => {
  const categoryId = req.params.categoryId;
  Category.findById(categoryId)
    .then(category => {
      if (!category) {
        return next(new Error('Category not found'));
      }
      fileHelper.deleteFile(category.imageUrl);

      return Category.deleteOne({ _id: categoryId });
    }).then(() => {
      console.log('DESTROYED Category');
      res.status(200).json({ message: 'Success!' });
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed!' });
    })
};


exports.getEditCategory = (req, res, next) => {
  const editMode = req.query.edit;

  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  if (!editMode) {
    return res.redirect('/');
  }
  const categoryId = req.params.categoryId;
  Category.findById(categoryId)
    .then(category => {
      if (!category) {
        return res.redirect('/');
      }
      res.render('admin/edit-category', {
        pageTitle: 'Edit Category',
        path: '/admin/edit-category',
        editing: editMode,
        category: category,
        errorMessage: message,
        validationErrors: []
      });
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed!' });
    })
};

exports.postEditCategory = (req, res, next) => {
  const categoryId = req.body.categoryId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.file;

  Category.findById(categoryId)
    .then(category => {
      category.title = updatedTitle;
      if (updatedImageUrl) {
        if (category.imageUrl) {
          fileHelper.deleteFile(category.imageUrl);
        }
        category.imageUrl = updatedImageUrl.path;
      }
      return category.save();
    })
    .then(result => {
      console.log('UPDATED Category!');
      res.redirect('/admin/categories');
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed!' });
    })
};

//News

exports.getAddNews = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('admin/news/edit-news', {
    pageTitle: 'Add News',
    path: '/admin/news/add-news',
    editing: false,
    hasError: false,
    errorMessage: message,
    oldInputs: { title: '', description: '', imageUrl: '' },
    validationErrors: []
  });
};

exports.postAddNews = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageUrl = req.file;
  const dt = DateTime.local();
  const date = dt.toLocaleString();
  const errors = validationResult(req);

  if (!imageUrl) {
    return res.status(422).render('admin/news/edit-news', {
      path: '/admin/news/edit-news',
      pageTitle: 'Add News',
      editing: false,
      news: {
        title: title,
        date: date,
        description: description
      },
      hasError: true,
      errorMessage: 'Attached file is not an image.',
      validationErrors: []
    });
  }
  const imagePath = imageUrl.path;

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/news/edit-news', {
      path: '/admin/news/edit-news',
      pageTitle: 'Add News',
      editing: false,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      oldInputs: { title: title, imageUrl: imageUrl, description: description, date: date },
      validationErrors: errors.array()
    });
  } else {
    const news = new News({
      title: title, description: description, imageUrl: imagePath, date: date
    })
    news.save().then(result => {
      res.redirect('/admin/news/news');
    }).catch(err => {
      res.status(500).json({ message: 'Failed!' });
    })
  }
}

exports.getEditNews = (req, res, next) => {
  const editMode = req.query.edit;

  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  if (!editMode) {
    return res.redirect('/');
  }
  const newsId = req.params.newsId;
  News.findById(newsId)
    .then(news => {
      if (!news) {
        return res.redirect('/');
      }
      res.render('admin/news/edit-news', {
        pageTitle: 'Edit News',
        path: '/admin/news/edit-news',
        editing: editMode,
        news: news,
        errorMessage: message,
        validationErrors: []
      });
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed!' });
    })
};

exports.postEditNews = (req, res, next) => {
  const newsId = req.body.newsId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.file;
  const updatedDescription = req.body.description;
  const updatedDt = DateTime.local();
  const updatedDate = dt.toLocaleString();

  News.findById(newsId)
    .then(news => {
      news.title = updatedTitle;
      if (updatedImageUrl) {
        fileHelper.deleteFile(news.imageUrl);
        news.imageUrl = updatedImageUrl.path;
      }
      // news.imageUrl = updatedImageUrl;
      news.description = updatedDescription;
      news.date = updatedDate;
      return news.save();
    })
    .then(result => {
      console.log('UPDATED News!');
      res.redirect('/admin/news/news');
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed!' });
    })
};

exports.getNews = (req, res, next) => {
  News.find().then(news => {
    res.render('admin/news/news', {
      pageTitle: 'News',
      path: '/admin/news/news',
      news: news,
    });
  })
};

exports.deleteNews = (req, res, next) => {
  const newsId = req.params.newsId;
  News.findById(newsId).then(news => {
    if (!news) {
      console.log('News not found')
    }
    fileHelper.deleteFile(news.imageUrl);
    return News.deleteOne({ _id: newsId }).then(() => {
      res.status(200).json({ message: 'Success!' })
    }).catch(err => {
      res.status(500).json({ message: 'Failed!' });
    })
  })
}
