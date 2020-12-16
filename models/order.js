const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [
    {
      product: { type: Object, required: true },
    }
  ],
  total: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    default: 'delivering',
  }
  // user: {
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     required: true,
  //     ref: 'User'
  //   }
  // }

  // user: {
  //   email: {
  //     type: String,
  //     required: true
  //   },
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     required: true,
  //     ref: 'User'
  //   }
  // }
});

module.exports = mongoose.model('Order', orderSchema);
