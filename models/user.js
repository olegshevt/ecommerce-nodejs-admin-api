const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false
  },
  lastname: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'register',
    enum: ["register", "admin"]
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true },
        total: {
          type: Number,
          required: true
        },
        // title: {
        //   type: String,
        //   required: true
        // },
        // imageUrl: {
        //   type: String,
        //   required: true
        // },
        // price: {
        //   type: Number,
        //   required: true
        // },
        // categoryId: {
        //   type: Schema.Types.ObjectId,
        //   ref: 'Category',
        //   required: false
        // },
      }
    ]
  },
  favourite: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true },
        total: {
          type: Number,
          required: true
        },
        // title: {
        //   type: String,
        //   required: true
        // },
        // imageUrl: {
        //   type: String,
        //   required: true
        // },
        // price: {
        //   type: Number,
        //   required: true
        // },
        // categoryId: {
        //   type: Schema.Types.ObjectId,
        //   ref: 'Category',
        //   required: false
        // },
      }
    ]
  }
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  let newTotal = product.price;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;

    newTotal = product.price * newQuantity;
    updatedCartItems[cartProductIndex].total = newTotal;

  } else {
    updatedCartItems.push({
      productId: product._id,
      // title: product.title,
      // imageUrl: product.imageUrl,
      // price: product.price,
      total: newTotal,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.plusItemToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  const updatedCartItems = [...this.cart.items];

  newQuantity = this.cart.items[cartProductIndex].quantity + 1;
  updatedCartItems[cartProductIndex].quantity = newQuantity;

  newTotal = product.price * newQuantity;
  updatedCartItems[cartProductIndex].total = newTotal;

  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.minusItemToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  const updatedCartItems = [...this.cart.items];

  newQuantity = this.cart.items[cartProductIndex].quantity - 1;
  updatedCartItems[cartProductIndex].quantity = newQuantity;

  newTotal = product.price * newQuantity;
  updatedCartItems[cartProductIndex].total = newTotal;

  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

//FAVOURITE

userSchema.methods.addToFavourite = function (product) {
  const favouriteProductIndex = this.favourite.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });

  const updatedFavouriteItems = [...this.favourite.items];

  if (favouriteProductIndex < 0) {

    updatedFavouriteItems.push({
      productId: product._id,
      // title: product.title,
      // imageUrl: product.imageUrl,
      // price: product.price,
      total: 1,
      quantity: 1
    });
  }

  const updatedFavourite = {
    items: updatedFavouriteItems
  };
  this.favourite = updatedFavourite;
  return this.save();
};

userSchema.methods.removeFromFavourite = function (productId) {
  const updatedCartItems = this.favourite.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.favourite.items = updatedCartItems;
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

